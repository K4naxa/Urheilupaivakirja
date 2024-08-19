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
        backgroundColor: "rgb(var(--color-bg-secondary))",
        color: "rgb(var(--color-text-primary))",
        borderColor: errors.sportId && errors.sportId.value === 'error'
          ? 'red'
          : errors.sportId && errors.sportId.value === 'success'
          ? 'green'
          : provided.borderColor,
    }),
    input: (provided) => ({
      ...provided,
      color: "rgb(var(--color-text-primary))",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgb(var(--color-primary))"
        : state.isFocused
          ? "rgb(var(--color-hover-select))"
          : "rgb(var(--color-bg-secondary))",
      color: state.isDisabled
        ? "rgb(var(--color-text-secondary))"
        : "rgb(var(--color-text-primary))",
      ":active": {
        backgroundColor: "rgb(var(--color-bg-primary))",
        color: "rgb(var(--color-text-primary))",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgb(var(--color-bg-secondary))",
      color: "rgb(var(--color-text-primary))",
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
          inputClass
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
        placeholder="Valitse tai luo laji"
        isClearable
        formatCreateLabel={formatCreateLabel}
        menuPortalTarget={document.body}
        menuPlacement="auto"
        menuShouldScrollIntoView={true}

      />
  );
};

export default SportSelect;
