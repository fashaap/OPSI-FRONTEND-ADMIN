import Swal from "sweetalert2";
Swal;

export const btnAllertDeleteAccount = () => {
  const handleSubmitButton = async () => {
    Swal.fire({
      title: "Apa kamu yakin?",
      text: "Anda tidak akan dapat mengembalikan akun pelajar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus ini!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("deleted");
        Swal.fire({
          title: "Dihapus!",
          text: "Seluruh akun pelajar telah dihapus",
          icon: "success",
        });
      }
    });
  };
  return {
    handleSubmitButton,
  };
};

export const btnAllertPermission = () => {
  const handleSubmitButton = async () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan menolak permintaan pelajar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Saya Yakin!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Ditolak");
        Swal.fire({
          title: "Permintaan Ditolak",
          text: "Permintaan pelajar telah ditolak.",
          icon: "success",
        });
      }
    });
  };
  return {
    handleSubmitButton,
  };
};

