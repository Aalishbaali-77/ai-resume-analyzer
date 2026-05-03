import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

    const ResumeCard = ({ resume: {id, companyName, jobTitle, feedback, imagePath} }: { resume: Resume }) => {
    return (
        <Link
            to={`/resume/${id}`}
            className="resume-card p-4 bg-white rounded-xl shadow-md h-full w-full max-w-[550px]">

            <div className= "resume-card-header">
            <div className= "flex flex-col gap-2">
                <h2 className=" !text-black font-bold wrap-break-word ">{companyName}</h2>
                <h3 className="text-lg wrap-break-word text-gray-500" >{jobTitle}</h3>
            </div>
            <div className="flex-shrink-0">
                <ScoreCircle score={feedback.overallScore} />
            </div>
            </div>
            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="h- w-auto object-contain scale-100 shadow-md">
                    <img
                        src={imagePath}
                        alt="resume"
                        className="w-full p-6 bg-white rounded-xl shadow-md"
                    />
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;