import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfVentaService {

  generarPdf(cabecera: any, detalles: any[]) {
    const documentDefinition: any = {
      content: [
        { text: 'Comprobante de Venta', style: 'header' },
        { text: `Número: ${cabecera.numeroComprobante}`, margin: [0, 10, 0, 5] },
        { text: `Tipo: ${cabecera.tipoComprobante}`, margin: [0, 0, 0, 5] },
        { text: `Fecha de Emisión: ${cabecera.fechaEmision}`, margin: [0, 0, 0, 5] },
        { text: `Cliente: ${cabecera.nombreCliente} (${cabecera.identificacion})`, margin: [0, 0, 0, 10] },

        // Tabla de detalles
        { text: 'Detalles del Comprobante:', style: 'subheader' },
        {
          table: {
            widths: ['*', '*', 'auto', 'auto'],
            body: [
              // Encabezados
              ['Producto', 'Descripción', 'Cantidad', 'Precio Unitario'],

              // Filas de productos
              ...detalles.map(detalle => [
                detalle.nombreProducto,
                detalle.descripcion,
                detalle.cantidad,
                `$${detalle.precio}`,
              ]),
            ],
          },
          margin: [0, 10, 0, 10],
        },

        // Totales
        {
          columns: [
            { text: 'Subtotal:', width: 'auto' },
            { text: `$${cabecera.subtotal}`, alignment: 'right' },
          ],
        },
        {
          columns: [
            { text: 'IVA:', width: 'auto' },
            { text: `${cabecera.iva}%`, alignment: 'right' },
          ],
        },
        {
          columns: [
            { text: 'Total:', width: 'auto', bold: true },
            { text: `$${cabecera.total}`, alignment: 'right', bold: true },
          ],
        },
      ],

      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      },
    };

    // Generar y abrir el PDF
    pdfMake.createPdf(documentDefinition).open();
  }
}
