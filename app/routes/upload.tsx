import {type FormEvent, useState} from 'react';
import Navbar from "~/components/Navbar";

const Upload = () => {
  const[isProcessing, setIsProcessing] = useState();
  const [statusText, setStatusText] = useState('');
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {}


  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">

        {/* Navbar */}
        <Navbar />
        {/* Hero Section */}
        <section className="main-section text-center py-20 px-6">
          <div className = "page-heading py-16">
            <h1>Smart Feedback for your dream job</h1>
            {isProcessing ? (
                <>
                <h2>{statusText}</h2>
                  <img src= "/images/resume-scan.gif" className = "w-full" />
                </>
                ) : (
                    <h2>Drop your resume for an ATS score and Improvement</h2>
                )}
            {!isProcessing && (
                <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 ">
                    <div className="form-div">
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text"
                               id="company-name"
                               placeholder="Enter company name"
                               name="company name"
                               required/>
                    </div>
                    <div className="form-div">
                        <label htmlFor="job-title">Job Title</label>

                        <input
                            type="text"
                            id="job-title"
                            name="jobTitle"
                            placeholder="Enter job title"
                            name="jobTitle"
                            required
                        />
                    </div>
                    <div className="form-div">
                        <label htmlFor="job-description">Job Description</label>
                        <textarea rows={5}
                               id="job-description"
                               placeholder="Enter job description"
                               name="jobDescription"
                               required/>
                    </div>
                </form>
            )}
          </div>
        </section>
      </main>
  );
};

export default Upload;