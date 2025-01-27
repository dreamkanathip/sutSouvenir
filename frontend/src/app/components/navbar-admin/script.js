document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggler = document.querySelector(".sidebar-toggler");

  if (sidebar && sidebarToggler) {
    console.log("Sidebar and Toggler found!"); // เช็คว่า sidebar และ toggler พบหรือไม่
    sidebarToggler.addEventListener("click", () => {
      console.log("Sidebar toggled!"); // ลองแสดงข้อความเพื่อเช็คว่าคลิกแล้วหรือยัง
      sidebar.classList.toggle("collapsed");
    });
  } else {
    console.error("Sidebar or toggler button not found.");
  }
});
