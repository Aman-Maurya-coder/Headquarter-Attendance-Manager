import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


export default function Dashboard() {
	const [selected, setSelected] = useState(null);
	const [dateSubj, setDateSubj] = useState([]);

	useEffect(() => {
		console.log("data");
		let Cdate = new Date();
		let ddata = { req_date: Cdate };
		const fetchData = async () => {
			try {
				const res = await fetch('http://localhost:8000/api/v1/dashboard/DateData', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(ddata),
					credentials: 'include',
				});

				if (!res.ok) {
					throw new Error('Failed to fetch Subjectsss');
				}
				let resp = await res.json();
				let data = resp.data;
				setDateSubj(data);
				console.log("Fetched data:", data);

				// console.log("Fetched data:", data);
				// let unique_subjects = new Set();
				// let subjects = [];
				// for (let day of weekdays) {
				//   day = day.toLowerCase()
				//   // console.log("Day:", day);
				//   let weekday_sub = data[day];
				//   let day_sub_name = weekday_sub.map((sub) => sub.subjectId.name);
				//   // console.log(day_sub_name)
				//   setDay_sub((prev) => ({ ...prev, [day]: day_sub_name }));
				//   // console.log(day_sub)

				//   for (let subject of weekday_sub) {
				//     subjects.push(subject.subjectId.name)
				//   }
				//   // console.log("Subjects:", subjects);
				//   subjects.forEach(element => unique_subjects.add(element));
				// }
				// console.log(day_sub);
				// setUser_sub([...unique_subjects])
			} catch (err) {
				// setError(err.message);
			} finally {
				// setLoading(false);
			}
		};
		fetchData();
	}, []);





	const options = ["Option 1", "Option 2", "Option 3"];

	return (
		<div className="flex  bg-black w-[100%] h-4/5 text-white "  >
			<div className=" w-1/2 border-2  rounded-2xl h-[100vh] m-3 bg-[#1C1C1C] border-gray-600">
				<h1 className="text-center text-2xl font-bold p-3">Todays Sub :</h1>
				<div className="grid grid-cols-1 grid-rows-5 gap-4 items-center m-3 ">
					{console.log(dateSubj)}
					{
						dateSubj.map(({ subjectId, status }) => (
							<div key={subjectId._id} className="flex justify-between items-center border-2 border-gray-600 rounded-2xl p-4 bg-[#2A2A2A] hover:bg-gray-700 transition duration-300">
									<h2 className="text-xl font-semibold">{subjectId.name}</h2>
									{/* <p className="text-gray-400">{subjectId.subjCode}</p> */}
									<div className="flex gap-4">
									<div>
										<input type="radio" value="Present" id={subjectId._id+"pressent"}/> 
										<label htmlFor={subjectId._id+"pressent"} className="me-2">Present</label>
									</div>
									<div>
										<input type="radio" value="Absent" id={subjectId._id+"Absent"}/> 
										<label htmlFor={subjectId._id+"Absent"} className="me-2">Absent</label>
									</div>
									<div>
										<input type="radio" value="Cancelled" id={subjectId._id+"Cancelled"}/> 
										<label htmlFor={subjectId._id+"Cancelled"} className="me-2">Cancelled</label>
									</div>
									</div>

							</div>
						))
					}
					
				</div>
			</div>
			<div className="w-1/2 border-2 border-gray-600 rounded-2xl m-3 bg-[#1C1C1C] ">
				<h1 className="text-center text-2xl font-bold p-3">Weekly Time Table</h1>
			</div>
		</div>
	);
}
