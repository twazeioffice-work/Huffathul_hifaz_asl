# Location: services/core-backend/app/core/reports/pdf_generator.py
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors


def generate_progress_report_pdf(
    student_name: str,
    attendance: float,
    grade: str,
    sabaq_list: list,
    institution_name: str = "Suffat-ul Huffaz",
    academic_year: str = "2026-2027",
) -> bytes:
    """
    Renders a pixel-perfect, print-safe student progress PDF report
    using ReportLab vector canvas layouts.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        textColor=colors.HexColor("#0A0F1D"),
        spaceAfter=15,
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "DocBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
    )

    story = []

    # Header Block
    story.append(Paragraph(institution_name.upper(), title_style))
    story.append(Paragraph("<b>OFFICIAL STUDENT PROGRESS &amp; HIFZ REPORT</b>", subtitle_style))
    story.append(Spacer(1, 15))

    # Student Metadata Grid
    meta_data = [
        [
            Paragraph(f"<b>Student Name:</b> {student_name}", body_style),
            Paragraph(f"<b>Attendance Rate:</b> {attendance:.1f}%", body_style),
        ],
        [
            Paragraph(f"<b>Overall Evaluation Grade:</b> {grade}", body_style),
            Paragraph(f"<b>Academic Year:</b> {academic_year}", body_style),
        ],
    ]
    meta_table = Table(meta_data, colWidths=[270, 270])
    meta_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(meta_table)
    story.append(Spacer(1, 20))

    # Sabaq Memorization Ledger
    story.append(Paragraph("<b>RECENT MEMORIZATION ENTRIES (SABAQ)</b>", styles["Heading3"]))
    story.append(Spacer(1, 8))

    ledger_header = ["Date", "Juz Number", "Page Start", "Page End", "Grade"]
    ledger_data = [ledger_header]
    for s in sabaq_list:
        ledger_data.append(
            [
                str(s.get("date", "")),
                str(s.get("juz_number", "")),
                str(s.get("page_start", "")),
                str(s.get("page_end", "")),
                str(s.get("grade", "")),
            ]
        )

    ledger_table = Table(ledger_data, colWidths=[100, 100, 100, 100, 140])
    ledger_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0D9488")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
            ]
        )
    )
    story.append(ledger_table)
    story.append(Spacer(1, 25))

    # Summary Footer
    total_entries = len(sabaq_list)
    story.append(
        Paragraph(
            f"<i>Total memorization entries recorded this period: <b>{total_entries}</b></i>",
            body_style,
        )
    )

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
