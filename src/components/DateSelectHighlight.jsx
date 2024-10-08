import React from 'react';
import { PickersDay, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';



/**
 * Description placeholder
 *
 * @param {{ highlightedDates: any; selectedDate: any; handleDateChange: any; }} param0
 * @param {*} param0.highlightedDates //dates to highlight in calendar
 * @param {*} param0.selectedDate //the state date value
 * @param {*} param0.handleDateChange //the function to change date selection
 * @returns {*}
 */
const DateSelectHighlight = ({highlightedDates, selectedDate, handleDateChange, highlightedMessage}) => {

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const HighlightedDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const isHighlighted = highlightedDates.some((highlightedDate) =>
      dayjs(day).isSame(highlightedDate, 'day')  // Using dayjs's `isSame` method for comparison
    );

    const isPastDate = dayjs(day).isBefore(dayjs(), 'day');

    // Define tooltip message based on the date
    // const tooltipMessage = isHighlighted ? 
    //   (isPastDate ? 'This date is highlighted but in the past.' : 'This date is highlighted.') 
    //   : '';

    const tooltipMessage = isHighlighted ? highlightedMessage : '';

    return (
      <Tooltip title={tooltipMessage} arrow placement="top" enterDelay={500} >
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          disableMargin
          style={{
            ...(isHighlighted && {
              backgroundColor: isPastDate ? '#d3d3d3' : '#e0983a', // Grey out past highlighted days
              color: isPastDate ? 'grey' : 'white', // Change text color for past days
            }),
          }}
        />
      </Tooltip>
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
