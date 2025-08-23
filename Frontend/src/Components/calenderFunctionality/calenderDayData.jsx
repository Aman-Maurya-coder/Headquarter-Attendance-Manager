import react from "react";

const calenderDayData = ({ day, modifiers, onClick, ref }) => {
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await fetch('http://localhost:8000/api/v1/upload/getSubjects', {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include',
            });
    
            if (!res.ok) {
              throw new Error('Failed to fetch Subjectsss');
            }
            let data = await res.json();
            console.log("Fetched data:", data);
            data = data.data;
            // console.log("Fetched data:", data);
            let unique_subjects = new Set();
            let subjects = [];
            for (let day of weekdays) {
              day = day.toLowerCase()
              // console.log("Day:", day);
              let weekday_sub = data[day];
              let day_sub_name = weekday_sub.map((sub) => sub.subjectId.name);
              // console.log(day_sub_name)
              setDay_sub((prev) => ({ ...prev, [day]: day_sub_name }));
              // console.log(day_sub)
    
              for (let subject of weekday_sub) {
                subjects.push(subject.subjectId.name)
              }
              // console.log("Subjects:", subjects);
              subjects.forEach(element => unique_subjects.add(element));
            }
            // console.log(day_sub);
            setUser_sub([...unique_subjects])
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, []);

    };

    
    export default calenderDayData;