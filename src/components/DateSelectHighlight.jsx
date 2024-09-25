import React from 'react';
import { PickersDay, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';


/**
 * Description placeholder
 *
 * @param {{ highlightedDates: any; selectedDate: any; handleDateChange: any; }} param0
 * @param {*} param0.highlightedDates //dates to highlight in calendar
 * @param {*} param0.selectedDate //the state date value
 * @param {*} param0.handleDateChange //the function to change date selection
 * @returns {*}
 */
const DateSelectHighlight = ({highlightedDates, selectedDate, handleDateChange}) => {


  const HighlightedDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const isHighlighted = highlightedDates.some((highlightedDate) =>
      dayjs(day).isSame(highlightedDate, 'day')  // Using dayjs's `isSame` method for comparison
    );

    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        disableMargin
        style={{
          ...(isHighlighted && {
            backgroundColor: '#e0983a', // Highlight color
            color: 'white', // Text color
          }),
        }}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb' >
      <DesktopDatePicker
        label="Plan Date"
        minDate={dayjs()}//dayjs gets today as default. therefore sits min date to today
        value={selectedDate}
        onChange={handleDateChange}
        slots={{
          day: HighlightedDay,  // Passing the custom day component
        }}
        renderInput={(params) => <TextField {...params} />} // Ensuring TextField is used properly
      />
    </LocalizationProvider>
  );
};

export default DateSelectHighlight;
