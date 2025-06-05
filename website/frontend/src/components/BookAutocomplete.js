import React from 'react';
import WindowedSelect from 'react-windowed-select';

// Filter: only show titles that START with input (case-insensitive)
const startsWithFilter = (option, input) => {
  if (!input) return true;
  return option.label.toLowerCase().startsWith(input.toLowerCase());
};

const BookAutocomplete = ({ value, onChange, options }) => {
  return (
    <WindowedSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Search for a book..."
      isClearable
      isSearchable
      filterOption={startsWithFilter}
    />
  );
};

export default BookAutocomplete;
