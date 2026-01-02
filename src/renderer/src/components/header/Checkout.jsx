import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/user/userSlice';
import { Power } from 'lucide-react';

const Checkout = () => {
  const dispatch = useDispatch();
  const [remark, setRemark] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const user = useSelector((state) => state.user.value);
  const handleCheckoutClick = () => {
    setShowModal(true);
  };

  const confirmCheckout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          remark: remark,
        }),
      });
      if (res.ok) {
        setConfirmModal(false);
        setShowModal(false);
        setRemark('');
        dispatch(logout());
        navigate('/signin');
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div>
        <button
          onClick={handleCheckoutClick}
          className="relative flex items-center justify-center text-gray-500 transition-colors bg-red-500 border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-red-400 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <Power className="text-white" />
        </button>

        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3 className="text-lg font-semibold mb-4">Add Remark</h3>

              <textarea
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter remark before checkout..."
                rows={10}
                className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
              ></textarea>

              <div className="flex justify-center gap-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600">
                  Cancel
                </button>

                <button
                  onClick={() => setConfirmModal(true)}
                  disabled={!remark}
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-blue-300"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {confirmModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-101"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-semibold mb-3">Confirm Checkout</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to checkout with remark:
              <span className="font-semibold text-red-500"> "{remark}" </span> ?
            </p>

            <div className="flex justify-center gap-4">
              <button onClick={() => setConfirmModal(false)} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600">
                Cancel
              </button>
              <button onClick={confirmCheckout} className="px-4 py-2 rounded bg-red-600 text-white">
                Sure
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
