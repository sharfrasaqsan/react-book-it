import Swal from "sweetalert2";

export const confirmDialog = async ({ title, text }) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });
  return result.isConfirmed;
};
