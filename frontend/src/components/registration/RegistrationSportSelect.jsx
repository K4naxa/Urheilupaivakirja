import React from 'react';
import CreatableSelect from 'react-select/creatable';

const SportSelect = ({
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
        errors.sportId && errors.sportId.value === 'error'
          ? 'red'
          : errors.sportId && errors.sportId.value === 'success'
          ? 'green'
          : provided.borderColor,
    }),
  };

  const sportOptions = options.sports.map((sport) => ({
    value: sport.id,
    label: sport.name,
  }));

  const formatCreateLabel = (inputValue) => `Luo uusi ryhmä: "${inputValue}"`;

  return (
      <CreatableSelect
        styles={customStyles}
        createOptionPosition="first"
        className={
          inputClass +
          (errors.sportId && errors.sportId.value
            ? errors.sportId.value === 'error'
              ? ' border-red-500'
              : errors.sportId.value === 'success'
              ? ' border-green-500'
              : ''
            : '')
        }
        value={
          registrationData.sportId
            ? sportOptions.find((option) => option.value === registrationData.sportId)
            : null
        }
        onChange={(selectedOption) =>
          handleDropdownChange({
            target: {
              name: 'sportId',
              value: selectedOption ? selectedOption.value : '',
            },
          })
        }
        options={sportOptions}
        placeholder="Valitse ryhmä"
        isClearable
        formatCreateLabel={formatCreateLabel}
      />
  );
};

export default SportSelect;
