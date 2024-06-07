import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

const ExportConfirmed = () => {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/registrations/confirmed');
        const registrationsData = await response.json();
        registrationsData.docs.forEach((doc, index) => {
          const registrationDoc = {
            index: index + 1,
            name: doc.name,
            gender: doc.gender === 'male' ? 'Nam' : 'Nữ',
            dateOfBirth: formatDate(doc.dateOfBirth),
            email: doc.email,
            targetGroup:
              doc.targetGroup === 'pupil'
                ? 'Học sinh'
                : doc.targetGroup === 'student'
                  ? 'Sinh viên'
                  : 'Người đi làm',
            schoolOrCompany: doc.schoolOrCompany,
            knowledgeLevel:
              doc.knowledgeLevel === '1'
                ? 'Chưa biết gì'
                : doc.knowledgeLevel === '2'
                  ? 'Tương đối hiểu biết'
                  : doc.knowledgeLevel === '3'
                    ? 'Hiểu biết'
                    : 'Chuyên gia',
            expectation: doc.expectation || '',
          };
          setRegistrations((prev) => [...prev, registrationDoc]);
        });
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // console.log(registrations);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const exportToExcel = () => {
    const headers = [
      { label: 'STT', key: 'index' },
      { label: 'Họ và tên', key: 'name' },
      { label: 'Giới tính', key: 'gender' },
      { label: 'Ngày sinh', key: 'dateOfBirth' },
      { label: 'Email', key: 'email' },
      { label: 'Đối tượng', key: 'targetGroup' },
      { label: 'Trường học/Công ty', key: 'schoolOrCompany' },
      { label: 'Mức hiểu biết', key: 'knowledgeLevel' },
      { label: 'Mong muốn đạt được', key: 'expectation' },
    ];

    const data = registrations.map((row) =>
      headers.map((header) => row[header.key]),
    );

    const worksheetData = [headers.map((header) => header.label), ...data];

    worksheetData.unshift(['DANH SÁCH ĐĂNG KÝ HỌC HÈ ĐÃ XÁC NHẬN']);

    const mergeRange = {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 8 },
    };

    // Merge các ô trong phạm vi
    const merges = [mergeRange];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Áp dụng merge cho worksheet
    ws['!merges'] = merges;

    // Format styles cho title, header và cell
    const titleStyle = {
      font: { bold: true, sz: '13' },
      alignment: { horizontal: 'center', vertical: 'center' },
      width: 80,
    };

    const headerStyle = {
      font: { bold: true },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
      alignment: { horizontal: 'center', vertical: 'center' },
      width: 40,
    };

    const cellStyle = {
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
      alignment: { vertical: 'center', wrapText: true },
    };

    const customCellStyle = {
      alignment: { ...cellStyle.alignment, horizontal: 'center' },
    };

    // Áp dụng style vào hàng title
    const titleRange = XLSX.utils.decode_range('A1:I1');
    for (let R = titleRange.s.r; R <= titleRange.e.r; ++R) {
      for (let C = titleRange.s.c; C <= titleRange.e.c; ++C) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) {
          if (!cell.s) cell.s = {};
          cell.s = { ...titleStyle };
        }
      }
    }

    // Áp dụng style vào hàng headers
    const headerRange = XLSX.utils.decode_range('A2:I2');
    for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) {
          if (!cell.s) cell.s = {};
          cell.s = { ...headerStyle };
        }
      }
    }

    // Áp dụng style cho các ô trong bảng
    const dataRange = XLSX.utils.decode_range(
      'A3:I' + (worksheetData.length + 2),
    );
    for (let R = dataRange.s.r; R <= dataRange.e.r; ++R) {
      for (let C = dataRange.s.c; C <= dataRange.e.c; ++C) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) {
          if (!cell.s) cell.s = {};

          // Nếu là cột A hoặc cột C thì dùng custom style (vẫn chưa áp dụng được!)
          if (C === 0 || C === 2) {
            cell.s = { ...customCellStyle, ...cellStyle };
          } else {
            cell.s = { ...cellStyle };
          }
        }
      }
    }

    // Đặt chiều rộng cho cột
    const wsCols = [
      { wpx: 40 }, // STT
      { wpx: 150 }, // Họ và tên
      { wpx: 80 }, // Giới tính
      { wpx: 100 }, // Ngày sinh
      { wpx: 200 }, // Email
      { wpx: 120 }, // Đối tượng
      { wpx: 200 }, // Trường học/Công ty
      { wpx: 120 }, // Mức hiểu biết
      { wpx: 300 }, // Mong muốn đạt được
    ];
    ws['!cols'] = wsCols;

    // Đặt chiều cao cho dòng
    const wsRows = [
      { hpx: 40 }, // Title
      { hpx: 20 }, // Headers
    ];
    ws['!rows'] = wsRows;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'DanhSachDangKyHocHeDaXacNhan.xlsx');
  };

  return (
    <div>
      {!loading && (
        <Button
          icon={<DownloadOutlined />}
          style={{
            backgroundColor: '#0B7077',
            margin: '20px 0px',
          }}
          type="primary"
          onClick={exportToExcel}
        >
          Xuất danh sách
        </Button>
      )}
    </div>
  );
};

export default ExportConfirmed;
