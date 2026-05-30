import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useSupabaseStore } from "~/lib/store";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const { fs, db } = useSupabaseStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file,
                                 }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        setIsProcessing(true);

        setStatusText("Uploading resume...");
        const uploadedPdf = await fs.upload(file, "resumes");
        if (!uploadedPdf) {
            setStatusText("Error: Failed to upload resume");
            setIsProcessing(false);
            return;
        }

        setStatusText("Converting to image...");
        const imageResult = await convertPdfToImage(file);
        if (!imageResult.file) {
            setStatusText("Error: Failed to convert PDF to image");
            setIsProcessing(false);
            return;
        }

        setStatusText("Uploading preview image...");
        const uploadedImage = await fs.upload(imageResult.file, "resume-images");
        if (!uploadedImage) {
            setStatusText("Error: Failed to upload image");
            setIsProcessing(false);
            return;
        }

        setStatusText("Saving record...");
        const resumeId = await db.saveResume({
            company_name: companyName,
            job_title: jobTitle,
            job_description: jobDescription,
            resume_path: uploadedPdf.path,
            image_path: uploadedImage.url,
            feedback: null,
        });
        if (!resumeId) {
            setStatusText("Error: Failed to save record");
            setIsProcessing(false);
            return;
        }

        setStatusText("Analyzing resume with AI...");
        const analyzeForm = new FormData();
        analyzeForm.append("resume", file);
        analyzeForm.append("jobTitle", jobTitle);
        analyzeForm.append("jobDescription", jobDescription);

        const response = await fetch("/api/analyze", {
            method: "POST",
            body: analyzeForm,
        });

        if (!response.ok) {
            const { error } = await response.json();
            setStatusText(`Error: ${error}`);
            setIsProcessing(false);
            return;
        }

        const { feedback } = await response.json();

        setStatusText("Saving analysis...");
        await db.updateFeedback(resumeId, feedback);

        setStatusText("Done! Redirecting...");
        setTimeout(() => navigate(`/resume/${resumeId}`), 1000);
    };


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;
        const form = e.currentTarget;
        const formData = new FormData(form);
        handleAnalyze({
            companyName: (formData.get("company-name") as string) ?? "",
            jobTitle: (formData.get("job-title") as string) ?? "",
            jobDescription: (formData.get("job-description") as string) ?? "",
            file,
        });
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img
                                src="/images/resume-scan.gif"
                                className="w-full"
                                alt="scanning"
                            />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form
                            id="upload-form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 mt-8"
                        >
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input
                                    type="text"
                                    name="company-name"
                                    placeholder="Company Name"
                                    id="company-name"
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input
                                    type="text"
                                    name="job-title"
                                    placeholder="Job Title"
                                    id="job-title"
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea
                                    rows={5}
                                    name="job-description"
                                    placeholder="Job Description"
                                    id="job-description"
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={setFile} />
                            </div>
                            <button
                                className="primary-button"
                                type="submit"
                                disabled={!file}
                            >
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;