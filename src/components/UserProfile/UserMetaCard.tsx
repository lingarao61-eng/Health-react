import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();

  // --------------------------------------------
  // USER DATA (MATCHES XANO)
  // --------------------------------------------
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  // --------------------------------------------
  // LOAD USER FROM XANO /auth/me
  // --------------------------------------------
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("authToken");
      if (!token) return setLoading(false);

      try {
        const res = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:7sOVqxPz/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        setUser({
          name: data.name || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  // --------------------------------------------
  // GET INITIALS
  // --------------------------------------------
  const getInitials = () => {
    if (!user.name) return "U";
    const parts = user.name.trim().split(" ");

    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials();

  // --------------------------------------------
  // FORM STATE
  // --------------------------------------------
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:7sOVqxPz/auth/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData), // { name, email }
        }
      );

      setUser({ ...formData });
      closeModal();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading)
    return <p className="p-5 text-gray-500 dark:text-gray-400">Loading...</p>;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          {/* AVATAR + USER INFO */}
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-brand-500 text-white text-2xl font-semibold">
              {initials}
            </div>

            <div className="text-center xl:text-left">
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                {user.name}
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* EDIT BUTTON */}
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs 
            hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 
            dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
          </div>

          <form className="flex flex-col">
            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">

              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                User Details
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div className="col-span-2">
                  <Label>Full Name</Label>
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
