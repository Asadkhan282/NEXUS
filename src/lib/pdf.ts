import { jsPDF } from 'jspdf';
import { ChatMessage } from '../types';

export const exportChatToPDF = async (messages: ChatMessage[], sessionTitle: string = 'NEXUS Neural Export') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let cursorY = 30;

  // Header
  doc.setFillColor(20, 20, 20); // Dark background for header
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(0, 255, 170); // Nexus Accent color
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NEXUS', margin, 20);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('NEURAL LINK LOG EXPORT v3.1', margin, 30);
  doc.text(`DATE: ${new Date().toLocaleString()}`, pageWidth - margin - 60, 30);

  cursorY = 50;

  messages.forEach((msg, index) => {
    // Check for page break
    if (cursorY > pageHeight - 40) {
      doc.addPage();
      cursorY = 20;
    }

    // Role Label
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'bold');
    const roleText = msg.role === 'user' ? 'IDENTITY: USER' : 'IDENTITY: NEXUS';
    doc.text(roleText, margin, cursorY);
    cursorY += 5;

    // Content
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    
    const content = typeof msg.content === 'string' ? msg.content : 'Multimodal content suppressed in PDF v1.0';
    const splitText = doc.splitTextToSize(content, maxWidth);
    
    // Message container background (subtle)
    const textHeight = (splitText.length * 5) + 5;
    if (msg.role === 'assistant') {
      doc.setFillColor(245, 245, 245);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(margin - 2, cursorY - 4, maxWidth + 4, textHeight + 2, 'F');
    
    doc.text(splitText, margin, cursorY);
    cursorY += textHeight + 10;
  });

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('END OF NEURAL TRANSMISSION', pageWidth / 2, pageHeight - 10, { align: 'center' });

  doc.save(`${sessionTitle.toLowerCase().replace(/\s+/g, '_')}_export.pdf`);
};

export const exportArtifactToPDF = async (type: string, title: string, content: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(0, 255, 170);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ARTIFACT SYNTHESIS', margin, 20);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), margin, 30);
  
  doc.setFontSize(8);
  const typeText = `TYPE: ${type.toUpperCase()}`;
  doc.text(typeText, pageWidth - margin - 40, 30);

  let cursorY = 55;
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.setFont('courier', 'normal'); // Use courier for artifact content (code/text)

  const lines = doc.splitTextToSize(content, maxWidth);
  
  for (let i = 0; i < lines.length; i++) {
    if (cursorY > pageHeight - 20) {
      doc.addPage();
      cursorY = 20;
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += 5;
  }

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};
