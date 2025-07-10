import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay, ThumbsUp, ThumbsDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  useAskLectureQuestionMutation,
  useGetLectureQuestionsQuery,
  useReplyLectureQuestionMutation,
  useLikeLectureQuestionMutation,
  useUnlikeLectureQuestionMutation,
  useAddReplyToLectureQuestionMutation,
} from "@/features/api/courseProgressApi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Certificate = ({ userName, courseTitle, completionDate }) => (
  <div
    id="certificate"
    style={{
      width: 800,
      height: 600,
      background: "#fff",
      border: "16px solid #2563eb",
      borderRadius: 24,
      margin: "0 auto",
      position: "relative",
      fontFamily: "'Montserrat', 'Lato', 'Arial', sans-serif",
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      overflow: "hidden"
    }}
  >
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..." // <-- Replace with your actual base64 string
      alt="PATASHALA Logo"
      style={{
        width: 80,
        position: "absolute",
        top: 32,
        right: 32,
      }}
    />
    <div style={{
      textAlign: "center",
      position: "relative",
      zIndex: 1,
      padding: "80px 40px 40px 40px"
    }}>
      <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 32, margin: 0 }}>PATASHALA</h2>
      <h1 style={{ fontSize: 40, fontWeight: 700, margin: "24px 0 8px 0", letterSpacing: 2, color: "#222" }}>Certificate</h1>
      <p style={{ fontSize: 20, color: "#444", margin: "0 0 24px 0" }}>This is to certify that</p>
      <div style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px 0", color: "#111" }}>{userName}</div>
      <p style={{ fontSize: 18, color: "#444", margin: "0 0 16px 0" }}>has successfully completed the course</p>
      <div style={{ fontSize: 26, fontWeight: 600, color: "#2563eb", margin: "0 0 24px 0" }}>{courseTitle}</div>
      <div style={{ fontSize: 18, color: "#222", margin: "0 0 32px 0" }}>
        <b>Date:</b> {completionDate}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40 }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 14, color: "#888" }}>Certificate ID:</div>
          <div style={{ fontWeight: 600, color: "#2563eb" }}>{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, color: "#888" }}>Signature</div>
          <div style={{ fontWeight: 600, color: "#222" }}>PATASHALA Team</div>
        </div>
      </div>
    </div>
  </div>
);

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(markCompleteData);

    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [askLectureQuestion, { isLoading: isAsking }] = useAskLectureQuestionMutation();
  const [replyLectureQuestion, { isLoading: isReplying }] = useReplyLectureQuestionMutation();
  const [likeLectureQuestion] = useLikeLectureQuestionMutation();
  const [unlikeLectureQuestion] = useUnlikeLectureQuestionMutation();
  const [addReplyToLectureQuestion] = useAddReplyToLectureQuestionMutation();
  const [replyInputs, setReplyInputs] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [showCertificate, setShowCertificate] = useState(false);

  // Always define these, even if data is not yet loaded
  const initialLecture = data?.data?.courseDetails?.lectures?.[0] || null;
  const currentLectureId = currentLecture?._id || initialLecture?._id;
  const { data: questionsData, refetch: refetchQuestions } = useGetLectureQuestionsQuery(
    { courseId, lectureId: currentLectureId },
    { skip: !currentLectureId }
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;
  if (!initialLecture) return <p>No lectures found for this course.</p>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle, creator } = courseDetails;

  // Debug log
  console.log('user:', user, 'creator:', creator);
  // Ensure both IDs are strings for comparison
  const isCreator = user && creator && String(creator) === String(user._id);

  // Redirect to instructor view if user is the creator
  if (isCreator) {
    return <Navigate to={`/instructor-course-view/${courseDetails._id}`} />;
  }

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };
  // Handle select a specific lecture to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };
  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    await askLectureQuestion({ courseId, lectureId: currentLectureId, question });
    setQuestion("");
    refetchQuestions();
  };
  const handleReply = async (questionId) => {
    if (!reply.trim()) return;
    await replyLectureQuestion({ questionId, reply });
    setReply("");
    setReplyingTo(null);
  };

  // Sort comments
  const sortedQuestions = [...(questionsData?.data || [])].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "mostLiked") return (b.likes?.length || 0) - (a.likes?.length || 0);
    return 0;
  });

  const handleDownloadCertificate = async () => {
    setShowCertificate(true);
    setTimeout(async () => {
      const input = document.getElementById("certificate");
      const canvas = await html2canvas(input, { useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [800, 600] });
      pdf.addImage(imgData, "PNG", 0, 0, 800, 600);
      pdf.save("certificate.pdf");
      setShowCertificate(false);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      {/* Display course name  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        {/* Only show for non-instructors and when user/creator are loaded */}
        {user && creator && user._id !== creator._id && (
          <Button
            onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
            variant={completed ? "outline" : "default"}
          >
            {completed ? (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>
              </div>
            ) : (
              "Mark as completed"
            )}
          </Button>
        )}
        {/* Show Download Certificate button if completed */}
        {completed && (
          <Button onClick={handleDownloadCertificate} className="ml-4" variant="secondary">
            Download Certificate
          </Button>
        )}
      </div>
      {/* Show certificate preview for download only */}
      {showCertificate && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
          <Certificate
            userName={user?.name}
            courseTitle={courseTitle}
            completionDate={new Date().toLocaleDateString()}
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section  */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                user && creator && user._id !== creator._id && handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
            />
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2 ">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                courseDetails.lectures.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture._id)
                ) + 1
              } : ${
                currentLecture?.lectureTitle || initialLecture.lectureTitle
              }`}
            </h3>
          </div>
          <div className="mt-8">
            <h4 className="font-semibold mb-2 text-lg">
              {questionsData?.data ? `${questionsData.data.length} Comments` : "Comments"}
            </h4>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-600">Sort by</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="mostLiked">Most liked</option>
              </select>
            </div>
            {/* Comment input at the top */}
            {user && user.role === "student" && (
              <div className="flex items-start gap-3 mb-6">
                <Avatar>
                  <AvatarImage src={user.photoUrl} alt={user.name} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Add a comment..."
                    className="mb-2"
                  />
                  <Button onClick={handleAskQuestion} disabled={isAsking || !question.trim()}>
                    {isAsking ? "Posting..." : "Comment"}
                  </Button>
                </div>
              </div>
            )}
            {/* Comment list, YouTube style */}
            <div className="space-y-0.5">
              {sortedQuestions.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
              {sortedQuestions.map(q => {
                const likedByUser = q.likes?.some(id => id === user?._id);
                const repliesOpen = expandedReplies[q._id];
                return (
                  <div key={q._id} className="py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={q.studentId?.photoUrl} alt={q.studentId?.name} />
                        <AvatarFallback>{q.studentId?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-base">{q.studentId?.name || "Student"}</span>
                          <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-[15px] mb-2 mt-0.5">{q.question}</div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={async () => {
                              if (likedByUser) {
                                await unlikeLectureQuestion(q._id);
                              } else {
                                await likeLectureQuestion(q._id);
                              }
                              refetchQuestions();
                            }}
                            disabled={!user || user.role !== "student"}
                            aria-label={likedByUser ? "Unlike" : "Like"}
                          >
                            <ThumbsUp className={likedByUser ? "text-blue-600" : "text-gray-400"} size={18} />
                          </Button>
                          <span className="text-xs">{q.likes?.length || 0}</span>
                          <Button
                            size="sm"
                            variant="link"
                            className="px-1 py-0"
                            onClick={() => setShowReplyInput({ ...showReplyInput, [q._id]: !showReplyInput[q._id] })}
                          >
                            Reply
                          </Button>
                          {q.replies?.length > 0 && (
                            <Button
                              size="sm"
                              variant="link"
                              className="px-1 py-0 text-blue-600"
                              onClick={() => setExpandedReplies({ ...expandedReplies, [q._id]: !repliesOpen })}
                            >
                              {repliesOpen ? `Hide ${q.replies.length} repl${q.replies.length === 1 ? "y" : "ies"}` : `${q.replies.length} repl${q.replies.length === 1 ? "y" : "ies"}`}
                            </Button>
                          )}
                        </div>
                        {/* Reply input only when Reply is clicked */}
                        {showReplyInput[q._id] && (
                          <div className="flex items-start gap-2 mt-2">
                            <Avatar>
                              <AvatarImage src={user?.photoUrl} alt={user?.name} />
                              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <Textarea
                              value={replyInputs[q._id] || ""}
                              onChange={e => setReplyInputs({ ...replyInputs, [q._id]: e.target.value })}
                              placeholder="Add a reply..."
                              className="mb-1"
                              rows={1}
                            />
                            <Button
                              size="sm"
                              onClick={async () => {
                                if ((replyInputs[q._id] || "").trim()) {
                                  await addReplyToLectureQuestion({ questionId: q._id, text: replyInputs[q._id] });
                                  setReplyInputs({ ...replyInputs, [q._id]: "" });
                                  setShowReplyInput({ ...showReplyInput, [q._id]: false });
                                  setExpandedReplies({ ...expandedReplies, [q._id]: true });
                                  refetchQuestions();
                                }
                              }}
                              disabled={!user || !(replyInputs[q._id] || "").trim()}
                            >
                              Reply
                            </Button>
                          </div>
                        )}
                        {/* Replies, collapsed/expanded */}
                        {q.replies && q.replies.length > 0 && repliesOpen && (
                          <div className="ml-8 mt-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-2">
                            {q.replies.map((r, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Avatar>
                                  <AvatarImage src={r.userId?.photoUrl} alt={r.userId?.name} />
                                  <AvatarFallback>{r.userId?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-medium text-xs">{r.userId?.name || "User"}</span>
                                  <span className="text-xs text-gray-400 ml-2">{new Date(r.createdAt).toLocaleString()}</span>
                                  <div className="text-sm mt-0.5">{r.text}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Lecture Sidebar  */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === (currentLecture?._id || initialLecture._id)
                    ? "bg-gray-200 dark:dark:bg-gray-800"
                    : ""
                } `}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {/* Only show progress for non-instructors */}
                    {user && creator && user._id !== creator._id && isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {/* Only show badge for non-instructors */}
                  {user && creator && user._id !== creator._id && isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
