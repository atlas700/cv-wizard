import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// export const generatePDF = async (elementId: string, fileName: string) => {
//   const element = document.getElementById(elementId);
//   if (!element) return;

//   const canvas = await html2canvas(element, {
//     scale: 2,
//     logging: false,
//     useCORS: true,
//   });

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");
//   const imgProps = pdf.getImageProperties(imgData);
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//   pdf.save(`${fileName}.pdf`);
// };

export async function generatePDF(element: HTMLElement) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("cv.pdf");
}
