// DateTimeInput.jsx

import React, { useState } from 'react';
import { DatePicker, DatePickerInput, TimePicker, TimePickerSelect, SelectItem } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules } from './FormUtils';

const DateTimeInput = ({ value, onChange, label, name, rules, disabled, className, ...props }) => {
  const { t } = useTranslation();
  const processedRules = processRules(rules, t);
  const { control } = useFormContext();

  const [timeValue, setTimeValue] = useState(value ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` : '');
  const [isTimePickerFocused, setIsTimePickerFocused] = useState(false);

  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={processedRules}
        disabled={disabled}
        render={({ field: { onChange, onBlur, value, disabled, name, ref }, fieldState: { invalid, isTouched, isDirty, error }, formState }) => {
          const id = control?._options.name ? control._options.name + '.' + name : name;

          const handleDateChange = (dates) => {
            if (dates.length > 0) {
              const date = dates[0];
              const [hours, minutes] = value?.time ? value.time.split(':') : [0, 0];
              const dateTime = new Date(date);
              dateTime.setHours(hours);
              dateTime.setMinutes(minutes);
              handleOnChange(dateTime);
            }
          };

          const handleTimeChange = (e) => {
            const time = e.target.value;
            setTimeValue(time);
          };

          const handleTimeBlur = () => {
            const [hoursStr, minutesStr] = timeValue.split(':');
            let date = value ? new Date(value) : new Date(Date.now());

            if (hoursStr !== undefined && hoursStr.length === 2) {
              const hours = parseInt(hoursStr, 10);
              if (!isNaN(hours)) {
                date.setHours(hours);
              }
            }

            if (minutesStr !== undefined && minutesStr.length === 2) {
              const minutes = parseInt(minutesStr, 10);
              if (!isNaN(minutes)) {
                date.setMinutes(minutes);
              }
            }

            handleOnChange(date);
            setIsTimePickerFocused(false);
          };

          const handleTimeFocus = () => {
            setIsTimePickerFocused(true);
          };

          const handleOnChange = (dateTimeValue) => {
            const event = {
              target: {
                name: name,
                value: dateTimeValue
              }
            };
            onChange(event);
          };

          return (
            <div>
              <DatePicker
                className={className}
                datePickerType="single"
                onChange={handleDateChange}
                onClose={function noRefCheck() {}}
                onOpen={function noRefCheck() {}}
                value={value ? value.toISOString().substring(0, 10) : ''}
                disabled={disabled}
              >
                <DatePickerInput
                  id={`${id}_date`}
                  name={name}
                  placeholder="mm/dd/yyyy"
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                  invalid={invalid}
                  invalidText={error?.message}
                  {...props}
                />
              </DatePicker>

              <TimePicker
                id={`${id}_time`}
                placeholder="hh:mm"
                value={isTimePickerFocused ? timeValue : value ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` : ''}
                onChange={handleTimeChange}
                onBlur={handleTimeBlur}
                onFocus={handleTimeFocus}
                disabled={disabled}
              >
                <TimePickerSelect id="time-picker-select" labelText="AM/PM">
                  <SelectItem value="AM" text="AM" />
                  <SelectItem value="PM" text="PM" />
                </TimePickerSelect>
              </TimePicker>
            </div>
          );
        }}
      ></Controller>
    </>
  );
};

DateTimeInput.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};

export default DateTimeInput;
