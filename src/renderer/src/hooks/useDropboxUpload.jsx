import { useCallback, useState } from 'react';

export const useDropboxUpload = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const refreshAccessToken = async () => {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: 'Ff0cBVnofU4AAAAAAAAAAUdSbY-ni54OXM66OQFPtLTK5jTvh4IhZ_MzY76WpMOI',
      client_id: '7vv35hpzk53zf9e',
      client_secret: 'b37u7y698fad99s',
    });

    const response = await fetch('https://api.dropbox.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) throw new Error('Failed to refresh token');
    return (await response.json()).access_token;
  };

  const uploadFileToDropbox = useCallback(async (file, folderPath) => {
    try {
      const token = await refreshAccessToken();

      const arrayBuffer = await file.arrayBuffer();

      const path = `${folderPath}/${file.name}`;

      const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: path,
            mode: 'add',
            autorename: true,
            mute: false,
          }),
        },
        body: arrayBuffer,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();

      const shareResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: result.path_lower,
          settings: {
            requested_visibility: 'public',
          },
        }),
      });

      let shareLink;
      if (shareResponse.ok) {
        const shareResult = await shareResponse.json();
        shareLink = shareResult.url.replace('dl=0', 'raw=1');
      } else {
        const listResponse = await fetch('https://api.dropboxapi.com/2/sharing/list_shared_links', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: result.path_lower,
            direct_only: true,
          }),
        });

        if (listResponse.ok) {
          const listResult = await listResponse.json();
          shareLink = listResult.links[0]?.url.replace('dl=0', 'raw=1');
        }
      }

      return {
        name: file.name,
        link: shareLink || `https://www.dropbox.com/scl/fi/${result.id}?rlkey=download&raw=1`,
        date: new Date().toISOString(),
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }, []);

  const createFolder = useCallback(async (folderPath) => {
    try {
      const token = await refreshAccessToken();

      const response = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: folderPath,
          autorename: false,
        }),
      });

      if (!response.ok && response.status !== 409) {
        throw new Error('Failed to create folder');
      }

      return true;
    } catch (error) {
      console.error('Folder creation error:', error);
      throw error;
    }
  }, []);

  const uploadFiles = useCallback(
    async (files, folderName) => {
      if (!files || files.length === 0) return [];

      setIsUploading(true);
      setUploadProgress({});

      const folderPath = `/${folderName}`;

      try {
        await createFolder(folderPath);

        const uploadPromises = files.map(async (file) => {
          try {
            const result = await uploadFileToDropbox(file, folderPath, (progress) => {
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: progress,
              }));
            });

            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: 100,
            }));

            return result;
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            throw error;
          }
        });

        const results = await Promise.all(uploadPromises);
        setIsUploading(false);
        return results;
      } catch (error) {
        setIsUploading(false);
        throw error;
      }
    },
    [createFolder, uploadFileToDropbox]
  );

  return {
    uploadFiles,
    uploadProgress,
    isUploading,
  };
};
