import jsPDF from 'jspdf';



const DownloadAsPDF = async (elementId) => {
  const input = document.getElementById(elementId);
  
  if (!input) return;

  try {
    // Create PDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;

    // Set default styling
    pdf.setFont('helvetica');
    pdf.setTextColor(51, 51, 51);

    // Function to convert content with image placeholders
    const resolveImageContent = (content) => {
      if (!content) return '';
      
      const baseUrl = `https://suite.snapsec.co/csm/uploads/`;
      
      // Replace image placeholders with actual img tags
      return content.replace(
        /{([a-zA-Z0-9]{16})}/g,
        (match, imageId) => `<img src="${baseUrl}${imageId}" class="max-w-full h-auto rounded-lg my-4" />`
      );
    };

    // Process images in HTML content
    const processImages = async (container) => {
      if (!container) return;
      
      const images = container.getElementsByTagName('img');
      for (const img of images) {
        try {
          if (!img.src) continue;

          // Create a new Image object to handle loading
          const imageLoaded = await new Promise((resolve, reject) => {
            const tempImg = new Image();
            tempImg.crossOrigin = 'Anonymous';  // Handle CORS
            tempImg.onload = () => resolve(tempImg);
            tempImg.onerror = reject;
            tempImg.src = img.src;
          });

          // Convert the loaded image to base64
          const canvas = document.createElement('canvas');
          canvas.width = imageLoaded.width;
          canvas.height = imageLoaded.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imageLoaded, 0, 0);
          const imgData = canvas.toDataURL('image/jpeg', 0.95);

          // Add to PDF with proper sizing
          if (currentY > pageHeight - 60) {
            pdf.addPage();
            currentY = margin;
          }

          const imgWidth = pageWidth - (2 * margin);
          const imgHeight = (imageLoaded.height * imgWidth) / imageLoaded.width;

          pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;

        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    };
    
    const processSection = async (title, content, options = {}) => {
      const { isBold = false, isLarge = false, noSpaceAfter = false } = options;
      
      if (currentY > pageHeight - 40) {
        pdf.addPage();
        currentY = margin;
      }

      if (title) {
        pdf.setFontSize(isLarge ? 16 : 14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin, currentY);
        currentY += 8;
      }

      if (content) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        
        // Create temporary container for content with resolved images
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = resolveImageContent(content);
        
        // First process any images
        await processImages(tempDiv);

        // Then process text
        const plainText = tempDiv.textContent || '';
        const lines = pdf.splitTextToSize(plainText.trim(), pageWidth - (2 * margin));
        
        lines.forEach(line => {
          if (currentY > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          if (line.trim()) {  // Only add non-empty lines
            pdf.text(line, margin, currentY);
            currentY += 6;
          }
        });
      }

      if (!noSpaceAfter) {
        currentY += 6;
      }
    };

    // Helper function to find a section by heading text
    const findSectionContent = (headingText) => {
      const headings = Array.from(input.getElementsByTagName('h2'));
      const heading = headings.find(h => h.textContent.trim() === headingText);
      if (!heading) return null;
      
      const nextElement = heading.nextElementSibling;
      return nextElement?.innerHTML || '';
    };

    // Add title
    const titleText = input.querySelector('h1')?.textContent || 'Vulnerability Report';
    await processSection(titleText, '', { isLarge: true });

    // Add metadata
    const statusElement = input.querySelector('[class*="text-blue-700"]');
    const cvssElement = input.querySelector('[class*="text-orange-700"]');
    
    if (statusElement || cvssElement) {
      pdf.setFontSize(11);
      if (statusElement) {
        pdf.text(`Status: ${statusElement.textContent.trim()}`, margin, currentY);
      }
      if (cvssElement) {
        pdf.text(`CVSS Score: ${cvssElement.textContent.trim()}`, pageWidth - margin - 40, currentY);
      }
      currentY += 15;
    }

    // Process main sections
    const sections = [
      'Summary',
      'Steps To Reproduce',
      'Impact',
      'CVSS Details',
      'Affected Assets'
    ];

    for (const sectionTitle of sections) {
      const content = findSectionContent(sectionTitle);
      if (content) {
        await processSection(sectionTitle, content);
      }
    }

    // Process attachments
    const attachmentsContent = findSectionContent('Attachments');
    if (attachmentsContent) {
      await processSection('Attachments', attachmentsContent);
    }

    // Process comments
    await processSection('Comments', '', { noSpaceAfter: true });

    const comments = Array.from(input.querySelectorAll('[class*="bg-gray-50"]'))
      .filter(el => el.querySelector('[class*="text-gray-700"]')); 

    for (const comment of comments) {
      const author = comment.querySelector('[class*="font-semibold"]')?.textContent || '';
      const date = comment.querySelector('[class*="text-gray-600"]')?.textContent || '';
      const textElement = comment.querySelector('[class*="text-gray-700"]') || 
                         comment.querySelector('[class*="pl-11"]');
      const text = textElement?.textContent || '';

      if (author && date) {
        await processSection('', `${author} - ${date}`, { isBold: true, noSpaceAfter: true });
      }
      if (text) {
        await processSection('', text);
        currentY += 4;
      }
    }

    // Save the PDF
    pdf.save('vulnerability-report.pdf');

  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

export default DownloadAsPDF;