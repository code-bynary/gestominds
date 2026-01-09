import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ReportRepository } from '../repositories/report.repository';
import ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export class ReportController {
    static async exportExcel(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            const filters = req.query;

            const transactions = await ReportRepository.getTransactionData(tenantId, filters);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Lançamentos');

            worksheet.columns = [
                { header: 'Data', key: 'date', width: 15 },
                { header: 'Descrição', key: 'description', width: 30 },
                { header: 'Tipo', key: 'type', width: 10 },
                { header: 'Categoria', key: 'category', width: 20 },
                { header: 'Conta', key: 'account', width: 20 },
                { header: 'Valor', key: 'amount', width: 15 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Pessoa', key: 'person', width: 20 },
            ];

            transactions.forEach(t => {
                worksheet.addRow({
                    date: t.date.toLocaleDateString('pt-BR'),
                    description: t.description,
                    type: t.type === 'INCOME' ? 'Receita' : 'Despesa',
                    category: t.category.name,
                    account: t.account.name,
                    amount: t.amount,
                    status: t.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente',
                    person: t.person?.name || '-',
                });
            });

            // Styling
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=lancamentos.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    static async exportPdf(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            const filters = req.query;

            const transactions = await ReportRepository.getTransactionData(tenantId, filters);

            const fonts = {
                Helvetica: {
                    normal: 'Helvetica',
                    bold: 'Helvetica-Bold',
                    italics: 'Helvetica-Oblique',
                    bolditalics: 'Helvetica-BoldOblique'
                }
            };

            const printer = new PdfPrinter(fonts);

            const docDefinition: TDocumentDefinitions = {
                content: [
                    { text: 'Relatório de Lançamentos - Gestor Minds', style: 'header' },
                    { text: `Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin: [0, 0, 0, 20] },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['auto', '*', 'auto', 'auto', 'auto'],
                            body: [
                                [
                                    { text: 'Data', style: 'tableHeader' },
                                    { text: 'Descrição', style: 'tableHeader' },
                                    { text: 'Categoria', style: 'tableHeader' },
                                    { text: 'Tipo', style: 'tableHeader' },
                                    { text: 'Valor', style: 'tableHeader' },
                                ],
                                ...transactions.map(t => [
                                    t.date.toLocaleDateString('pt-BR'),
                                    t.description,
                                    t.category.name,
                                    t.type === 'INCOME' ? 'Receita' : 'Despesa',
                                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)
                                ])
                            ]
                        }
                    }
                ],
                defaultStyle: { font: 'Helvetica' },
                styles: {
                    header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                    tableHeader: { bold: true, fontSize: 12, color: 'black' }
                }
            };

            const pdfDoc = printer.createPdfKitDocument(docDefinition);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');

            pdfDoc.pipe(res);
            pdfDoc.end();
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}
