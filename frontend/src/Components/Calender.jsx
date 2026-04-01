import React, { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ProfessionalCalendar = ({ selectedDate, setSelectedDate, selectedTime, setSelectedTime }) => {
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const [currentMonth, setCurrentMonth] = useState(todayMonth);
  const [currentYear, setCurrentYear] = useState(todayYear);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i);

  const isPast = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < new Date(todayYear, todayMonth, todayDay);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const getFormattedDate = (day) => {
    if (!day) return null;
    return new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const morningSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM"];
  const afternoonSlots = ["01:00 PM", "01:30 PM", "02:00 PM", "03:00 PM"];

  const renderTimeSlot = (slot) => (
    <button
      key={slot}
      onClick={() => setSelectedTime(slot)}
      className={`p-3 rounded-lg border w-full text-center transition-all font-medium
        ${selectedTime === slot ? "bg-green-600 text-white border-green-700 shadow-md" : "bg-white hover:bg-green-50 border-gray-200 text-gray-700"}`}
    >
      {slot}
    </button>
  );

  return (
    <div className="flex flex-col gap-8">

      {/* CALENDAR CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={handlePrevMonth} className="p-2 rounded-full bg-gray-200 hover:bg-green-100 transition-colors shadow">
            <IoChevronBack size={22} className="text-green-700" />
          </button>
          <h2 className="text-2xl font-extrabold text-[#35A114] tracking-wide">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button onClick={handleNextMonth} className="p-2 rounded-full bg-gray-200 hover:bg-green-100 transition-colors shadow">
            <IoChevronForward size={22} className="text-green-700" />
          </button>
        </div>

        {/* WEEKDAYS */}
        <div className="grid grid-cols-7 text-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">
          {days.map((day) => (
            <div key={day} className="py-2 text-green-700">{day}</div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day, index) => {
            if (!day) return <div key={index}></div>;

            const isToday = day === todayDay && currentMonth === todayMonth && currentYear === todayYear;
            const fullDateStr = getFormattedDate(day);
            const selected = selectedDate === fullDateStr;
            const past = isPast(day);

            return (
              <button
                key={index}
                disabled={past}
                onClick={() => !past && setSelectedDate(fullDateStr)}
                className={`
                  aspect-square flex items-center justify-center rounded-xl font-bold text-base transition-all
                  border-2
                  ${past
                    ? "text-gray-300 bg-gray-100 border-gray-200 cursor-not-allowed"
                    : selected
                    ? "bg-[#35A114] text-white border-green-700 shadow-lg scale-110 z-10"
                    : isToday
                    ? "bg-green-50 text-green-700 border-green-400 border"
                    : "text-[#2C3A23] hover:bg-green-50 border-gray-200"
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-8 p-4 bg-green-100 rounded-xl border border-green-300">
            <p className="text-base text-green-900 font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-green-700 rounded-full animate-pulse" />
              Selected: {selectedDate}
            </p>
          </div>
        )}
      </div>

      {/* TIME SELECTION CARD */}
      {selectedDate && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Select Time</h2>

          <h3 className="font-medium text-gray-700 mb-2">Morning</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {morningSlots.map(renderTimeSlot)}
          </div>

          <h3 className="font-medium text-gray-700 mb-2">Afternoon</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {afternoonSlots.map(renderTimeSlot)}
          </div>

          {selectedTime && (
            <p className="mt-4 text-green-700 font-medium">
              Selected Time: {selectedTime}
            </p>
          )}
        </div>
      )}

    </div>
  );
};

export default ProfessionalCalendar;
