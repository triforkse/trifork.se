export function getAllEmployees(callback) {
  $.ajax({
      url: "/team-data",
      success: callback
  });
}
