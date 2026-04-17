import { useTranslation } from "react-i18next";

function IconImagePlaceholder() {
    return (
        <svg className="record-report-media-svg" viewBox="0 0 48 48" width="48" height="48" aria-hidden>
            <rect x="6" y="10" width="36" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.85" />
            <circle cx="17" cy="22" r="3.5" fill="currentColor" fillOpacity="0.9" />
            <path
                d="M10 34 L18 26 L24 31 L38 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.85"
            />
        </svg>
    );
}

function IconVideoPlaceholder() {
    return (
        <svg className="record-report-media-svg" viewBox="0 0 48 48" width="48" height="48" aria-hidden>
            <rect x="5" y="11" width="38" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.85" />
            <path d="M20 19 L32 24 L20 29 Z" fill="currentColor" fillOpacity="0.95" />
        </svg>
    );
}

export default function RecordReportMediaPlaceholder({ kind }) {
    const { t } = useTranslation();
    const isVideo = kind === "video";

    return (
        <div
            className={`record-report-media-placeholder ${isVideo ? "record-report-media-placeholder--video" : "record-report-media-placeholder--image"}`}
            role="img"
            aria-label={isVideo ? t("club.recordReport.mediaAriaVideo") : t("club.recordReport.mediaAriaImage")}
        >
            <div className="record-report-media-placeholder-shine" aria-hidden />
            <div className="record-report-media-placeholder-inner">
                {isVideo ? <IconVideoPlaceholder /> : <IconImagePlaceholder />}
                <span className="record-report-media-placeholder-label">
                    {isVideo ? t("club.recordReport.mediaLabelVideo") : t("club.recordReport.mediaLabelImage")}
                </span>
            </div>
        </div>
    );
}
