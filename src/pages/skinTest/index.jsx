import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { postSkinTestResult } from "../../services/api.skinTest";

const questions = [
  {
    id: 1,
    question: "How does your skin feel at the end of the day (after a day of activities)?",
    options: [
      { id: 'A', text: "Oily and shiny, especially in the T-zone (forehead, nose, and chin)." },
      { id: 'B', text: "Still soft and comfortable." },
      { id: 'C', text: "Very dry, tight and may be flaking." },
      { id: 'D', text: "T-zone is oily, but cheeks are dry or normal." }
    ]
  },
  {
    id: 2,
    question: "What is the size of your facial pores?",
    options: [
      { id: 'A', text: "Large, easily visible pores" },
      { id: 'B', text: "Small, barely visible pores" },
      { id: 'C', text: "Very small, almost invisible pores" },
      { id: 'D', text: "Large pores in T-zone, small on cheeks" }
    ]
  },
  {
    id: 3,
    question: "How does your skin usually react to new skincare products?",
    options: [
      { id: 'A', text: "Easily irritated and prone to breakouts" },
      { id: 'B', text: "Rarely has issues" },
      { id: 'C', text: "Often becomes red and itchy" },
      { id: 'D', text: "Different reactions depending on face area" }
    ]
  },
  {
    id: 4,
    question: "When not using moisturizing cream, how does your skin feel?",
    options: [
      { id: 'A', text: "Still fine, even better than before" },
      { id: 'B', text: "Slightly dry but acceptable" },
      { id: 'C', text: "Very dry and uncomfortable" },
      { id: 'D', text: "Some areas are dry, some are still fine" }
    ]
  },
  {
    id: 5,
    question: "Do you often get pimples?",
    options: [
      { id: 'A', text: "Often, especially if they are red and swollen" },
      { id: 'B', text: "Sometimes, mainly during stress or menstrual periods" },
      { id: 'C', text: "Rarely get pimples" },
      { id: 'D', text: "Mainly get pimples in the T-zone" }
    ]
  },
  {
    id: 6,
    question: "When taking photos, how does your skin look?",
    options: [
      { id: 'A', text: "Usually shiny in photos" },
      { id: 'B', text: "Looks healthy and natural" },
      { id: 'C', text: "Usually looks dry and lacking vitality" },
      { id: 'D', text: "Forehead and nose are shiny, cheeks are dry" }
    ]
  },
  {
    id: 7,
    question: "How many times do you need to use oil-absorbing sheets in a day?",
    options: [
      { id: 'A', text: "Many times a day" },
      { id: 'B', text: "Rarely or never" },
      { id: 'C', text: "Never, because the skin doesn't produce enough oil to absorb" },
      { id: 'D', text: "Only need to use on the T-zone" }
    ]
  },
  {
    id: 8,
    question: "How does your skin react to hot weather?",
    options: [
      { id: 'A', text: "Produces more oil and is more prone to pimples" },
      { id: 'B', text: "Doesn't change much" },
      { id: 'C', text: "Becomes dry and more easily irritated" },
      { id: 'D', text: "T-zone produces more oil, cheeks are still normal" }
    ]
  },
  {
    id: 9,
    question: "When washing your face, if you don't apply moisturizer right away, how does your skin feel?",
    options: [
      { id: 'A', text: "No problem, it quickly produces oil again" },
      { id: 'B', text: "Slightly tight but still fine" },
      { id: 'C', text: "Very tight and uncomfortable, need to apply moisturizer right away" },
      { id: 'D', text: "Forehead and cheeks are tight, T-zone is fine" }
    ]
  },
  {
    id: 10,
    question: "Which moisturizing cream is the most suitable for you?",
    options: [
      { id: 'A', text: "Light gel, no oil" },
      { id: 'B', text: "Light moisturizing cream" },
      { id: 'C', text: "Rich, nutrient-rich cream" },
      { id: 'D', text: "Need to use different products for different areas" }
    ]
  }
];

const SkinTypeTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isStarted, setIsStarted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answer;
      return newAnswers;
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const result = calculateTestResult([...answers, answer]);
      handleSubmitResult(result);
    }
  };

  const calculateTestResult = (answers) => {
    const counts = answers.reduce((acc, answer) => {
      if (answer) {
        acc[answer] = (acc[answer] || 0) + 1;
      }
      return acc;
    }, {});

    let maxCount = 0;
    let mostFrequentAnswer = null;

    Object.entries(counts).forEach(([answer, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentAnswer = answer;
      }
    });

    const resultMap = {
      'A': 1, // Oily Skin
      'B': 2, // Normal Skin
      'C': 3, // Dry Skin
      'D': 4  // Combination Skin
    };

    return resultMap[mostFrequentAnswer];
  };

  const handleSubmitResult = async (testResultId) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token"); //Lấy token từ local storage
      if (!token) { //Kiểm tra xem token có tồn tại không
        toast.error("Please login to save the skin test result.");
        return;
      }

      const decodedToken = jwtDecode(token);//Giải mã token
      const userId = decodedToken.id;//Lấy id của user từ token

      const formData = { //Tạo form data để gửi lên API
        userId: userId, //Lấy id của user từ token
        testResultId: testResultId //Lấy id của kết quả kiểm tra da từ testResultId
      };

      await postSkinTestResult(formData); //Gửi form data lên API
      toast.success("Skin test result saved successfully!"); //Hiển thị thông báo thành công
      setTestResult(testResultId); //Lưu kết quả kiểm tra da vào state

    } catch (error) {
      console.error("Error sending result:", error); //Hiển thị lỗi nếu có lỗi
      toast.error("Cannot save result. Please try again."); //Hiển thị thông báo lỗi
    } finally {
      setIsSubmitting(false); //Đặt trạng thái submit về false
    }
  };

  const Header = () => (
    <header className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-pink-600 text-center">
          Skin Test
        </h1>
        <button
          onClick={() => window.location.href = '/'}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-pink-600
                   transition-colors duration-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </header>
  );

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              What is your Skin Type?
            </h2>
            <p className="text-gray-600 mb-6">
              Take the 3-minute skin type quiz now and build a skin care routine with medical-grade skincare brands.
            </p>
            <p className="text-gray-600 mb-8">
              Our free skin care routine quiz was developed by dermatologists to accurately diagnose your skin type.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setIsStarted(true)}
                className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-full
                         hover:bg-pink-600 transition-colors duration-200 shadow-md
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              >
                Start Skin Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testResult) {
    const resultMessages = {
      1: "You have Oily Skin",
      2: "You have Normal Skin",
      3: "You have Dry Skin",
      4: "You have Combination Skin"
    };

    return (
      <div className="min-h-screen bg-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Skin Type Result
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              {resultMessages[testResult]}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsStarted(false);
                  setCurrentQuestion(0);
                  setAnswers(Array(questions.length).fill(null));
                  setTestResult(null);
                }}
                className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-full
                         hover:bg-pink-600 transition-colors duration-200 shadow-md
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              >
                Take Test Again
              </button>

              <button
                onClick={() => {
                  window.location.href = `/routine/${testResult}`;
                }}
                className="px-8 py-3 ml-4 bg-pink-600 text-white font-semibold rounded-full
                         hover:bg-pink-700 transition-colors duration-200 shadow-md
                         focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-50"
              >
                View Recommended Routine
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="h-2 bg-pink-100 rounded-full">
              <div
                className="h-2 bg-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-gray-600">
              Question {currentQuestion + 1} / {questions.length}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.id)}
                  disabled={isSubmitting}
                  className={`w-full p-4 text-left rounded-lg border 
                           transition-colors duration-200 focus:outline-none focus:ring-2 
                           focus:ring-pink-500 focus:ring-opacity-50
                           ${answers[currentQuestion] === option.id
                      ? 'bg-pink-100 border-pink-500 text-pink-700'
                      : 'border-pink-200 hover:bg-pink-50 text-gray-700'
                    }
                           ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className={`font-medium ${answers[currentQuestion] === option.id ? 'text-pink-700' : 'text-pink-600'
                    }`}>
                    {option.id}.
                  </span>
                  <span className="ml-2">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                if (currentQuestion === 0) {
                  setIsStarted(false);
                } else {
                  setCurrentQuestion(prev => prev - 1);
                }
              }}
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-full font-medium
                       bg-pink-100 text-pink-600 hover:bg-pink-200
                       transition-colors duration-200 focus:outline-none
                       ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </div>
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={!answers[currentQuestion] || isSubmitting}
                className={`px-6 py-2 rounded-full font-medium
                         transition-colors duration-200 focus:outline-none
                         ${!answers[currentQuestion] || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                  }`}
              >
                <div className="flex items-center">
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  const result = calculateTestResult(answers);
                  handleSubmitResult(result);
                }}
                disabled={!answers[currentQuestion] || isSubmitting}
                className={`px-6 py-2 rounded-full font-medium
                         transition-colors duration-200 focus:outline-none
                         ${!answers[currentQuestion] || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                  }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinTypeTest;