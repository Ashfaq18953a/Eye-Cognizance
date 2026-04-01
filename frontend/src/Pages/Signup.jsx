// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff, X, ArrowLeft } from "lucide-react"; // Added Back Icon
// import registration from "../assets/Image/registration.jpg";

// const Signup = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [address, setAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [showSuccess, setShowSuccess] = useState(false);

//   // Password visibility states
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirmPass, setShowConfirmPass] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
//     if (!mobile) {
//       alert("Mobile number is required!");
//       return;
//     }
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           mobile,
//           password,
//           confirm_password: confirmPassword,
//           address,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setShowSuccess(true);
//       } else {
//         alert(data.message || "Registration failed");
//       }
//     } catch (error) {
//       alert("Backend not reachable");
//     }
//   };

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, X, ArrowLeft } from "lucide-react"; // Added Back Icon
import registration from "../assets/Image/registration.jpg";

const Signup = () => {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [address, setAddress] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);

	// Password visibility states
	const [showPass, setShowPass] = useState(false);
	const [showConfirmPass, setShowConfirmPass] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("Passwords do not match!");
			return;
		}
		if (!mobile) {
			alert("Mobile number is required!");
			return;
		}
		try {
			const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					mobile,
					password,
					confirm_password: confirmPassword,
					address,
				}),
			});
			const data = await response.json();
			if (response.ok) {
				setShowSuccess(true);
			} else {
				alert(data.message || "Registration failed");
			}
		} catch (error) {
			alert("Backend not reachable");
		}
	};

	const handleContinue = () => {
		setShowSuccess(false);
		navigate("/login");
	};

	const closePopup = () => {
		setShowSuccess(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 relative">

			{/* 🔙 BACK ICON */}
			<ArrowLeft
				size={28}
				className="absolute left-6 top-6 text-gray-800 cursor-pointer hover:text-black z-50"
				onClick={() => navigate(-1)}
			/>

			<div
				className={`$
					{showSuccess ? "hidden" : "block"}
				bg-[#6A8E4F] rounded-xl shadow-xl w-full max-w-5xl overflow-hidden`}
			>
				<div className="grid grid-cols-1 md:grid-cols-2">
					{/* Image */}
					<div className="w-full h-48 md:h-full md:p-10">
						<img
							src={registration}
							alt="Signup"
							className="w-full h-full rounded-2xl object-cover"
						/>
					</div>
					{/* Form */}
					<div className="p-6 flex flex-col justify-center">
						<h2 className="text-2xl font-bold mb-5 text-white">
							Registration Form
						</h2>
						<form method="POST" onSubmit={handleSubmit}>
							{/* Name */}
							<div className="mb-3">
								<label className="block text-white text-sm font-medium mb-1">
									Name
								</label>
								<input
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300"
									placeholder="Enter full name"
								/>
							</div>
							{/* Email */}
							<div className="mb-3">
								<label className="block text-white text-sm font-medium mb-1">
									Email
								</label>
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300"
									placeholder="Enter email"
								/>
							</div>
							{/* Mobile */}
							<div className="mb-3">
								<label className="block text-white text-sm font-medium mb-1">
									Mobile Number
								</label>
								<input
									type="tel"
									required
									value={mobile}
									onChange={(e) => setMobile(e.target.value)}
									className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300"
									placeholder="Enter mobile number"
								/>
							</div>
							{/* Password */}
							<div className="mb-3 relative">
								<label className="block text-white text-sm font-medium mb-1">
									Password
								</label>
								<input
									type={showPass ? "text" : "password"}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300 pr-10"
									placeholder="Enter password"
								/>
								{/* Eye Icon */}
								<span
									onClick={() => setShowPass(!showPass)}
									className="absolute right-4 top-9 text-gray-600 cursor-pointer"
								>
									{showPass ? <Eye size={18} /> : <EyeOff size={18} />}
								</span>
							</div>
							{/* Confirm Password */}
							<div className="mb-3 relative">
								<label className="block text-white text-sm font-medium mb-1">
									Confirm Password
								</label>
								<input
									type={showConfirmPass ? "text" : "password"}
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300 pr-10"
									placeholder="Re-enter password"
								/>
								{/* Eye Icon */}
								<span
									onClick={() => setShowConfirmPass(!showConfirmPass)}
									className="absolute right-4 top-9 text-gray-600 cursor-pointer"
								>
									{showConfirmPass ? <Eye size={18} /> : <EyeOff size={18} />}
								</span>
							</div>
							{/* Address */}
							<div className="mb-4">
								<label className="block text-white text-sm font-medium mb-1">
									Address
								</label>
								<textarea
									required
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									className="w-full p-2 text-sm rounded-lg h-20 resize-none bg-white outline-none focus:ring focus:ring-gray-300"
									placeholder="Enter address"
								></textarea>
							</div>
							{/* Button */}
							<button
								type="submit"
								className="p-5 bg-gray-800 text-white py-2 text-sm rounded-full font-semibold transition"
							>
								Create Account
							</button>
							</form>
							<p className="text-center text-white text-sm mt-5">
								Already have an account?{' '}
								<span
									className="underline cursor-pointer text-gray-900 font-semibold"
									onClick={() => navigate("/login")}
								>
									Login
								</span>
							</p>
					</div>
				</div>
			</div>
			{/* SUCCESS POPUP */}
			{showSuccess && (
				<div className="absolute top-20 flex justify-center items-center w-full z-50">
					<div className="bg-[#B0D07D] text-white rounded-xl p-8 w-full max-w-sm text-center shadow-2xl relative">
						<button
							onClick={closePopup}
							className="absolute top-3 right-3 text-white"
						>
							<X size={22} />
						</button>
						<div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-5xl font-bold">
							✓
						</div>
						<h2 className="text-2xl font-bold mb-2">Success!</h2>
						<p className="text-sm mb-6">
							Your account has been created successfully.
						</p>
						<button
							onClick={handleContinue}
							className="text-white bg-gray-900 font-semibold px-6 py-2 rounded-full"
						>
							Continue
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Signup;
//         setShowSuccess(true);
//       } else {
//         alert(JSON.stringify(data));
//       }
//     } catch (error) {
//       alert("Backend not reachable");
//     }
//   };

//   const handleContinue = () => {
//     setShowSuccess(false);
//     navigate("/login");
//   };

//   const closePopup = () => {
//     setShowSuccess(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative">

//       {/* 🔙 BACK ICON */}
//       <ArrowLeft
//         size={28}
//         className="absolute left-6 top-6 text-gray-800 cursor-pointer hover:text-black z-50"
//         onClick={() => navigate(-1)}
//       />

//       {!showSuccess && (
//         <div className="bg-[#6A8E4F] rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2">

//             {/* Image */}
//             <div className="w-full h-48 md:h-full md:p-10">
//               <img
//                 src={registration}
//                 alt="Signup"
//                 className="w-full h-full rounded-2xl object-cover"
//               />
//             </div>

//             {/* Form */}
//             <div className="p-6 flex flex-col justify-center">
//               <h2 className="text-2xl font-bold mb-5 text-white">
//                 Registration Form
//               </h2>

//               <form onSubmit={handleSubmit}>

//                 {/* Name */}
//                 <div className="mb-3">
//                   <label className="block text-white text-sm font-medium mb-1">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300"
//                     placeholder="Enter full name"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div className="mb-3">
//                   <label className="block text-white text-sm font-medium mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300"
//                     placeholder="Enter email"
//                   />
//                 </div>

//                 {/* Password */}
//                 <div className="mb-3 relative">
//                   <label className="block text-white text-sm font-medium mb-1">
//                     Password
//                   </label>
//                   <input
//                     type={showPass ? "text" : "password"}
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300 pr-10"
//                     placeholder="Enter password"
//                   />
//                   <span
//                     onClick={() => setShowPass(!showPass)}
//                     className="absolute right-4 top-9 text-gray-600 cursor-pointer"
//                   >
//                     {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
//                   </span>
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="mb-3 relative">
//                   <label className="block text-white text-sm font-medium mb-1">
//                     Confirm Password
//                   </label>
//                   <input
//                     type={showConfirmPass ? "text" : "password"}
//                     required
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300 pr-10"
//                     placeholder="Re-enter password"
//                   />
//                   <span
//                     onClick={() => setShowConfirmPass(!showConfirmPass)}
//                     className="absolute right-4 top-9 text-gray-600 cursor-pointer"
//                   >
//                     {showConfirmPass ? <Eye size={18} /> : <EyeOff size={18} />}
//                   </span>
//                 </div>

//                 {/* Address */}
//                 <div className="mb-4">
//                   <label className="block text-white text-sm font-medium mb-1">
//                     Address
//                   </label>
//                   <textarea
//                     required
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     className="w-full p-2 text-sm rounded-lg h-20 resize-none bg-white outline-none focus:ring focus:ring-gray-300"
//                     placeholder="Enter address"
//                   />
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   className="w-full bg-gray-800 text-white py-2 text-sm rounded-full font-semibold"
//                 >
//                   Create Account
//                 </button>

//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SUCCESS POPUP */}
//       {showSuccess && (
//         <div className="absolute top-20 flex justify-center items-center w-full z-50">
//           <div className="bg-[#B0D07D] text-white rounded-xl p-8 w-full max-w-sm text-center shadow-2xl relative">
//             <button
//               onClick={closePopup}
//               className="absolute top-3 right-3 text-white"
//             >
//               <X size={22} />
//             </button>

//             <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-5xl font-bold">
//               ✓
//             </div>

//             <h2 className="text-2xl font-bold mb-2">Success!</h2>
//             <p className="text-sm mb-6">
//               Your account has been created successfully.
//             </p>

//             <button
//               onClick={handleContinue}
//               className="text-white bg-gray-900 font-semibold px-6 py-2 rounded-full"
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Signup;



