function formatDate(dateString) {
  function padToTwoDigits(number) {
    return number.toString().padStart(2, '0');
  }

  // Tạo một đối tượng Date từ chuỗi đầu vào
  const date = new Date(dateString);

  // Lấy ngày, tháng và năm từ đối tượng Date
  const day = padToTwoDigits(date.getUTCDate());
  const month = padToTwoDigits(date.getUTCMonth() + 1); // Lưu ý: tháng bắt đầu từ 0
  const year = date.getUTCFullYear();

  // Tạo định dạng chuỗi DD/MM/YYYY
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

export default formatDate;
