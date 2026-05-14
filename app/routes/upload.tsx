import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "../components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";

const Upload = () => {
    const { fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
    };

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

        try {
            setStatusText("Uploading the file...");
            const uploadedFile = await fs.upload([file]);

            if (!uploadedFile) {
                setStatusText("Error: No file uploaded");
                return;
            }

            setStatusText("Converting PDF to image...");
            const imageFile = await convertPdfToImage(file);

            if (!imageFile?.file) {
                setStatusText("Failed to convert PDF to image");
                return;
            }

            setStatusText("Uploading the image...");
            const uploadedImage = await fs.upload([imageFile.file]);

            if (!uploadedImage) {
                setStatusText("Error: Failed to upload image");
                return;
            }

            setStatusText("Preparing data...");

            const uuid = generateUUID();

            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: "",
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analyzing your resume...");

            const feedback = await ai.feedback(
                uploadedFile.path,
                `Analyze this resume for the job title "${jobTitle}" at "${companyName}". Job description: ${jobDescription}`
            );

            await kv.set(
                `resume:${uuid}`,
                JSON.stringify({
                    ...data,
                    feedback,
                })
            );

            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error(error);
            setStatusText("Something went wrong while analyzing resume");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            alert("Please upload your resume PDF first");
            return;
        }

        const formData = new FormData(e.currentTarget);

        const companyName = formData.get("companyName") as string;
        const jobTitle = formData.get("jobTitle") as string;
        const jobDescription = formData.get("jobDescription") as string;

        handleAnalyze({
            companyName,
            jobTitle,
            jobDescription,
            file,
        });
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
            <Navbar />

            <section className="main-section text-center py-20 px-6">
                <div className="page-heading py-16">
                    <h1>Smart Feedback for your dream job</h1>

                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img
                                src="/images/resume-scan.gif"
                                className="w-full"
                                alt="Resume scanning animation"
                            />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and Improvement</h2>
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
                                    id="company-name"
                                    name="companyName"
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input
                                    type="text"
                                    id="job-title"
                                    name="jobTitle"
                                    placeholder="Enter job title"
                                    required
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea
                                    rows={5}
                                    id="job-description"
                                    name="jobDescription"
                                    placeholder="Enter job description"
                                    required
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Uploader</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze your Resume here!
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;