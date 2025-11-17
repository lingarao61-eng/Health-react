import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  // --------------------------------------------
  // USER DATA (BASED ON /auth/me RESPONSE)
  // --------------------------------------------
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  // --------------------------------------------
  // FETCH USER FROM XANO
  // --------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return setLoading(false);

    async function loadUser() {
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
      } catch (error) {
        console.error("Failed to load user:", error);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  // --------------------------------------------
  // INITIALS
  // --------------------------------------------
  const getInitials = () => {
    if (!user.name) return "U";

    const parts = user.name.trim().split(" ");

    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials();

  // --------------------------------------------
  // MODAL FORM HANDLING
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
      console.error("Update failed:", err);
    }
  };

  if (loading) return <p className="p-5 text-gray-500">Loading...</p>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        
        {/* LEFT SECTION – USER INFO */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
            
            {/* Name */}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* EDIT BUTTON + INITIAL ICON */}
        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 lg:w-auto"
        >
          <div className="h-9 w-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
          Edit
        </button>
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>

          <form className="flex flex-col">
            
            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                User Details
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                {/* Name */}
                <div className="col-span-2">
                  <Label>Full Name</Label>
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
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
    </div>
  );
}
