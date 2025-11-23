import jsPDF from 'jspdf';

/**
 * Generates a professional PDF ticket for the order
 * @param {Object} orderData - The order data object
 * @param {Object} orderDetails - Customer details (name, phone, notes, etc.)
 * @param {Array} cartItems - Array of cart items
 * @param {number} total - Order total total
 */
export const generateOrderTicket = (orderData, orderDetails, cartItems, total) => {
    const doc = new jsPDF();
    const pageWidth = 210; // A4 width in mm

    // === DECORATIVE HEADER ===
    // Top border decoration
    doc.setFillColor(218, 165, 32); // Gold color
    doc.rect(0, 0, pageWidth, 8, 'F');

    // Restaurant name
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(218, 165, 32); // Gold
    doc.text("MITAKE RAMEN", pageWidth / 2, 22, { align: 'center' });

    // Subtitle
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text("L'Artisanat du Bouillon à Aix-en-Provence", pageWidth / 2, 29, { align: 'center' });

    // Decorative separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(218, 165, 32);
    doc.line(40, 33, 170, 33);

    // === WELCOME MESSAGE ===
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text("Merci pour votre commande !", pageWidth / 2, 42, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text("Nous préparons votre commande avec soin.", pageWidth / 2, 48, { align: 'center' });

    // Order mode specific message
    const modeLabel = orderData.type === 'dine_in' ? 'Sur Place' :
        orderData.type === 'takeaway' ? 'À Emporter' :
            orderData.type === 'delivery' ? 'Livraison' : orderData.type;

    let waitMessage = "";
    if (orderData.type === 'dine_in') {
        waitMessage = "Nous vous attendons avec plaisir !";
    } else if (orderData.type === 'takeaway') {
        waitMessage = "Votre commande sera prête dans 15-20 minutes.";
    } else if (orderData.type === 'delivery') {
        waitMessage = "Votre commande sera livrée dans 30-40 minutes.";
    }

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(218, 165, 32);
    doc.text(waitMessage, pageWidth / 2, 54, { align: 'center' });

    // === ORDER INFO BOX ===
    let yPos = 65;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, yPos, 170, 35, 3, 3, 'F');

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text("INFORMATIONS DE COMMANDE", 25, yPos);

    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`N° ${orderData.order_number}`, 25, yPos);
    doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 25, yPos + 5);
    doc.text(`Mode: ${modeLabel}`, 25, yPos + 10);

    // === CUSTOMER INFO BOX ===
    yPos += 25;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, yPos, 170, 30, 3, 3, 'F');

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("INFORMATIONS CLIENT", 25, yPos);

    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Nom: ${orderDetails.customerName || 'N/A'}`, 25, yPos);
    doc.text(`Téléphone: ${orderDetails.phone || 'N/A'}`, 110, yPos);

    yPos += 7;
    if (orderDetails.notes) {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const notesText = `Notes: ${orderDetails.notes}`;
        const splitNotes = doc.splitTextToSize(notesText, 160);
        doc.text(splitNotes, 25, yPos);
        yPos += splitNotes.length * 5;
    }

    // === ITEMS TABLE ===
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("DÉTAILS DE VOTRE COMMANDE", 20, yPos);

    yPos += 8;
    // Table header
    doc.setFillColor(218, 165, 32);
    doc.rect(20, yPos - 5, 170, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("QTÉ", 25, yPos);
    doc.text("ARTICLE", 45, yPos);
    doc.text("PRIX UNIT.", 140, yPos);
    doc.text("TOTAL", 175, yPos, { align: 'right' });

    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Items list with alternating background
    cartItems.forEach((item, index) => {
        // Alternating row background
        if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(20, yPos - 5, 170, 7, 'F');
        }

        const unitPrice = item.price;
        const itemTotal = unitPrice * item.quantity;

        doc.text(`${item.quantity}`, 25, yPos);

        // Wrap long item names
        const itemName = doc.splitTextToSize(item.name, 90);
        doc.text(itemName, 45, yPos);

        doc.text(`${unitPrice.toFixed(2)} €`, 140, yPos);
        doc.text(`${itemTotal.toFixed(2)} €`, 185, yPos, { align: 'right' });

        yPos += 7 * itemName.length;
    });

    // === TOTAL ===
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(130, yPos, 190, yPos);

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(218, 165, 32);
    doc.text("TOTAL:", 130, yPos);
    doc.text(`${total.toFixed(2)} €`, 185, yPos, { align: 'right' });

    // === FOOTER MESSAGE ===
    yPos = 250;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text("Bon appétit ! 🍜", pageWidth / 2, yPos, { align: 'center' });

    // === CANCELLATION POLICY ===
    yPos += 10;
    doc.setFillColor(255, 245, 230);
    doc.roundedRect(15, yPos - 3, 180, 18, 2, 2, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 50, 50);
    doc.text("POLITIQUE D'ANNULATION", pageWidth / 2, yPos + 2, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    const disclaimer = "En cas d'annulation, merci de nous prévenir au moins 15 minutes à l'avance. Les annulations répétées\nsans préavis peuvent entraîner une restriction d'accès à notre service de commande en ligne.";
    doc.text(disclaimer, pageWidth / 2, yPos + 8, { align: 'center', maxWidth: 170 });

    // === BOTTOM DECORATION ===
    doc.setFillColor(218, 165, 32);
    doc.rect(0, 289, pageWidth, 8, 'F');

    // Save/Download PDF
    doc.save(`mitake-ticket-${orderData.order_number}.pdf`);
};
