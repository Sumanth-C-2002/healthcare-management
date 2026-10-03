import { useMemo, useState } from 'react';
import { getErrorInfo } from '../../api/client.js';
import { patientApi } from '../../api/services.js';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { formatDate, saveBlob } from '../../utils/format.js';

const loadRecords = () => patientApi.getRecords().then((res) => res.data);

export default function Records() {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(loadRecords);
  const [downloadingId, setDownloadingId] = useState(null);

  const records = useMemo(() => data ?? [], [data]);

  if (loading) return <PageLoader rows={0} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const onDownload = async (record) => {
    setDownloadingId(record.id);
    try {
      const res = await patientApi.downloadRecord(record.id);
      saveBlob(res.data, record.fileName || `medical-record-${record.id}`);
    } catch (err) {
      toast.error(getErrorInfo(err).message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <PageHeader title="Medical records" subtitle="Your diagnoses, prescriptions and reports, safely in one place." />

      {records.length === 0 ? (
        <EmptyState
          icon="bi-journal-medical"
          title="No medical records yet"
          text="After a completed visit, your doctor's notes and reports will appear here."
        />
      ) : (
        <div className="stack">
          {records.map((rec) => (
            <article className="panel record" key={rec.id}>
              <div className="record-icon">
                <i className="bi bi-file-earmark-medical" />
              </div>
              <div className="record-body">
                <div className="d-flex justify-content-between flex-wrap gap-2">
                  <div>
                    <h3 className="record-title">{rec.diagnosis}</h3>
                    <div className="appt-sub">
                      {rec.doctorName} · {formatDate(rec.recordDate)}
                    </div>
                  </div>
                  {rec.fileName && (
                    <button className="button soft sm" onClick={() => onDownload(rec)} disabled={downloadingId === rec.id}>
                      {downloadingId === rec.id ? <span className="spinner" /> : <i className="bi bi-download" />}
                      Download report
                    </button>
                  )}
                </div>
                {rec.prescription && (
                  <div className="rx">
                    <strong>Prescription and advice</strong>
                    {rec.prescription}
                  </div>
                )}
                {rec.fileName && (
                  <div className="appt-sub">
                    <i className="bi bi-paperclip" /> {rec.fileName}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}