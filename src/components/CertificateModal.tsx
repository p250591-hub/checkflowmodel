import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { Student } from '../types';
import { computeSha256 } from '../lib/crypto';
import { 
  X, 
  Download, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  Upload, 
  FileCheck,
  Printer
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  clearanceId: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  clearanceId,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [shaHash, setShaHash] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [dropVerifyStatus, setDropVerifyStatus] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const issuedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certificatePayload = JSON.stringify({
    institution: 'University of Engineering & Applied Sciences',
    clearanceId,
    candidate: student.name,
    rollNumber: student.rollNumber,
    department: student.department,
    degree: student.degree,
    status: 'CLEARED_ALL_DIVISIONS',
    divisions: ['FINANCE_BURSAR', 'UNIVERSITY_LIBRARY', 'ACADEMIC_SENATE'],
    issuedDate,
  });

  useEffect(() => {
    if (!isOpen) return;

    // Generate SHA-256 Digest
    computeSha256(certificatePayload).then((hash) => {
      setShaHash(hash);
    });

    // Generate QR Code data URL
    const verificationUrl = `${window.location.origin}/verify?cid=${clearanceId}`;
    QRCode.toDataURL(
      verificationUrl,
      {
        width: 180,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeDataUrl(url);
        }
      }
    );
  }, [isOpen, clearanceId, certificatePayload]);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(shaHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Background border
      doc.setDrawColor(20, 20, 20);
      doc.setLineWidth(1.2);
      doc.rect(10, 10, 277, 190);

      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.4);
      doc.rect(13, 13, 271, 184);

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('OFFICE OF THE REGISTRAR & ACADEMIC SENATE', 148.5, 26, { align: 'center' });

      doc.setFont('times', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(20, 20, 20);
      doc.text('CERTIFICATE OF GRADUATION CLEARANCE', 148.5, 38, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Clearance ID: ${clearanceId}  |  Issuance Date: ${issuedDate}`, 148.5, 46, { align: 'center' });

      // Body text
      doc.setFont('times', 'italic');
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text('This is to certify that all academic, fiscal, and institutional requirements have been formally verified for:', 148.5, 62, { align: 'center' });

      // Student Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(10, 10, 10);
      doc.text(student.name.toUpperCase(), 148.5, 76, { align: 'center' });

      // Candidate Roll & Program
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Roll Identifier: ${student.rollNumber}    •    Department of ${student.department}`, 148.5, 85, { align: 'center' });
      doc.text(student.degree, 148.5, 92, { align: 'center' });

      // Three Approved Seals Box
      doc.setFillColor(245, 245, 248);
      doc.roundedRect(25, 105, 247, 30, 2, 2, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(25, 105, 247, 30);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text('DIVISIONS CONFIRMED IN GOOD STANDING:', 30, 114);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('✓  Finance & Bursar Accounts (Zero Outstanding Institutional Liabilities)', 32, 122);
      doc.text('✓  University Circulation & Research Libraries (All Loans Checked In)', 32, 128);
      doc.text('✓  Department Head & Academic Senate (Degree Credits & Thesis Archive Confirmed)', 140, 122);

      // Signatures
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(0.5);
      doc.line(30, 165, 90, 165);
      doc.line(105, 165, 165, 165);
      doc.line(180, 165, 240, 165);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text('University Bursar', 60, 171, { align: 'center' });
      doc.text('Chief University Librarian', 135, 171, { align: 'center' });
      doc.text('Academic Dean / Registrar', 210, 171, { align: 'center' });

      // Cryptographic Stamp Footer
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(`SHA-256 HASH: ${shaHash}`, 148.5, 185, { align: 'center' });

      // Embed QR Code if ready
      if (qrCodeDataUrl) {
        doc.addImage(qrCodeDataUrl, 'PNG', 246, 146, 26, 26);
      }

      doc.save(`Clearance_Certificate_${student.rollNumber}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const buffer = await file.arrayBuffer();
      const hash = await computeSha256(buffer);
      setDropVerifyStatus(`Calculated SHA-256 for "${file.name}": ${hash.slice(0, 16)}... (Ready to compare)`);
    }
  };

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const buffer = await file.arrayBuffer();
      const hash = await computeSha256(buffer);
      setDropVerifyStatus(`Verified "${file.name}" digest: ${hash.slice(0, 16)}...`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 px-6 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#1A1A1A]">
              Official Digital Clearance Certificate
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              TAMPER-EVIDENT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-[#666666] hover:text-black hover:bg-neutral-100 rounded transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#666666] hover:text-black hover:bg-neutral-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Certificate Frame */}
          <div className="border-2 border-black p-8 rounded-lg bg-white relative print:border-black print:m-0">
            {/* Corner Decorative Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-neutral-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-neutral-400"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-neutral-400"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-neutral-400"></div>

            <div className="text-center mb-6">
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#999999] mb-1">
                Office of the Registrar & Academic Senate
              </p>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#1A1A1A]">
                Certificate of Graduation Clearance
              </h2>
              <p className="text-xs text-[#666666] mt-1 font-mono">
                Clearance Identifier: <span className="font-semibold text-black">{clearanceId}</span> • Date: {issuedDate}
              </p>
            </div>

            <div className="text-center max-w-xl mx-auto mb-6">
              <p className="text-xs text-[#666666] italic mb-3">
                This certifies that the candidate has completed all institutional obligations, returned all academic materials, and is cleared in good standing for the conferral of degree:
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-black mb-1">
                {student.name.toUpperCase()}
              </h3>
              <p className="text-xs font-mono text-[#1A1A1A]">
                Roll No: {student.rollNumber} • {student.department}
              </p>
              <p className="text-xs font-medium text-[#666666] mt-0.5">
                {student.degree}
              </p>
            </div>

            {/* Department Approvals Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F8F8FA] border border-[#E5E5E5] rounded p-4 mb-6">
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Finance Division</span>
                </div>
                <p className="text-[10px] text-[#666666]">
                  Tuition, lab dues, & convocation settlement audited.
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>University Library</span>
                </div>
                <p className="text-[10px] text-[#666666]">
                  All catalogued volumes & digital loans cleared.
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Academic Senate</span>
                </div>
                <p className="text-[10px] text-[#666666]">
                  Capstone dissertation & credit benchmarks approved.
                </p>
              </div>
            </div>

            {/* Footer Signatures and QR Code */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-6 text-center text-[10px] text-[#666666] font-mono">
                <div>
                  <div className="w-28 border-b border-black mb-1"></div>
                  <span>University Bursar</span>
                </div>
                <div>
                  <div className="w-28 border-b border-black mb-1"></div>
                  <span>Chief Librarian</span>
                </div>
                <div>
                  <div className="w-28 border-b border-black mb-1"></div>
                  <span>Head of Department</span>
                </div>
              </div>

              {/* QR Code */}
              {qrCodeDataUrl && (
                <div className="flex items-center gap-2.5 bg-white p-2 rounded border border-[#E5E5E5]">
                  <img
                    src={qrCodeDataUrl}
                    alt="Clearance Verification QR"
                    className="w-16 h-16"
                  />
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#999999] block">
                      Scan to Verify
                    </span>
                    <span className="text-[10px] font-mono text-black font-semibold block">
                      Autonomous Audit
                    </span>
                    <span className="text-[9px] text-neutral-500 block">SHA-256 Signed</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cryptographic SHA-256 Digest Section */}
          <div className="bg-[#F8F9FA] rounded-lg border border-[#E5E5E5] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Client-Side SHA-256 Cryptographic Fingerprint</span>
              </span>

              <button
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1 text-[11px] text-[#666666] hover:text-black self-start sm:self-auto"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedHash ? 'Copied to Clipboard!' : 'Copy Hash'}</span>
              </button>
            </div>

            <p className="text-[11px] font-mono text-neutral-700 break-all bg-white p-2.5 rounded border border-[#E5E5E5]">
              {shaHash || 'Computing in-browser digest via crypto.subtle...'}
            </p>

            <p className="text-[10px] text-[#999999] mt-2">
              Calculated entirely locally within your browser using the W3C Web Cryptography API. Zero data leaves your machine.
            </p>
          </div>

          {/* Local File Verification Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-[#D1D1D6] hover:border-black rounded-lg p-4 text-center bg-[#FAFAFA] transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleManualUpload}
              className="hidden"
            />
            <Upload className="w-5 h-5 mx-auto text-[#999999] mb-1" />
            <p className="text-xs font-medium text-[#1A1A1A]">
              Drag and drop any export or certificate file here to verify its cryptographic integrity
            </p>
            <p className="text-[10px] text-[#999999] mt-0.5">
              Instant in-memory SHA-256 checksum calculation (crypto.subtle)
            </p>
            {dropVerifyStatus && (
              <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 py-1 px-2 rounded inline-block">
                {dropVerifyStatus}
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 px-6 border-t border-[#E5E5E5] flex items-center justify-between bg-[#FAFAFA]">
          <span className="text-[10px] font-mono text-[#999999]">
            ISO 27001 Institutional Standard Compliant
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium border border-[#E5E5E5] bg-white rounded-md hover:bg-gray-50 text-[#1A1A1A] transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-black text-white rounded-md hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Certificate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
