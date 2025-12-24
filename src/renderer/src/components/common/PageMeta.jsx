import { HeadProvider, Title, Meta } from 'react-head';

export const AppWrapper = ({ children }) => <HeadProvider>{children}</HeadProvider>;

const PageMeta = ({ title, description }) => (
  <>
    <Title>{title}</Title>
    <Meta name="description" content={description} />
  </>
);

export default PageMeta;
