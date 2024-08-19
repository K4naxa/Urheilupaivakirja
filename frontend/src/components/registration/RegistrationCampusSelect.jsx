import React from 'react';
import Select from 'react-select';

const CampusSelect = ({
  inputClass,
  errorClass,
  errors,
  registrationData,
  options,
  handleDropdownChange,
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor:
        errors.campusId && errors.campusId.value === 'error'
          ? 'red'
          : errors.campusId && errors.campusId.value === 'success'
          ? 'green'
          : provided.borderColor,
    }),
  };

  const campusOptions = options.campuses.map((campus) => ({
    value: campus.id,
    label: campus.name,
  }));

  return (
      <Select
        styles={customStyles}
        className={
          inputClass +
          (errors.campusId && errors.campusId.value
            ? errors.campusId.value === 'error'
              ? ' border-red-500'
              : errors.campusId.value === 'success'
              ? ' border-green-500'
              : ''
            : '')
        }
        value={
          registrationData.campusId
            ? campusOptions.find((option) => option.value === registrationData.campusId)
            : null
        }
        onChange={(selectedOption) =>
          handleDropdownChange({
            target: {
              name: 'campusId',
              value: selectedOption ? selectedOption.value : '',
            },
          })
        }
        
        options={campusOptions}
        placeholder="Valitse kampus"
        isClearable
        noOptionsMessage={() => 'Ei tuloksia'}
        menuShouldScrollIntoView={true}
        menuPortalTarget={document.body}
        menuPlacement="auto"
      />
  );
};

export default CampusSelect;
