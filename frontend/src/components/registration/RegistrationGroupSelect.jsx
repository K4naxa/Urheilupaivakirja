import React from 'react';
import CreatableSelect from 'react-select/creatable';

const GroupSelect = ({
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
        borderColor: errors.groupId && errors.groupId.value === 'error'
          ? 'red'
          : errors.groupId && errors.groupId.value === 'success'
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
    singleValue: (provided) => ({
      ...provided,
      color: "rgb(var(--color-text-primary))", // Ensure the displayed value text color is color-text-primary
    }),
  };

  const groupOptions = options.student_groups.map((group) => ({
    value: group.id,
    label: group.name,
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
          registrationData.groupId
            ? groupOptions.find((option) => option.value === registrationData.groupId)
            : null
        }
        onChange={(selectedOption) =>
          handleDropdownChange({
            target: {
              name: 'groupId',
              value: selectedOption ? selectedOption.value : '',
            },
          })
        }
        options={groupOptions}
        
        placeholder="Valitse tai luo ryhmä"
        isClearable
        formatCreateLabel={formatCreateLabel}
        menuPortalTarget={document.body}
        menuPlacement="auto"
        menuShouldScrollIntoView={true}
      />
  );
};

export default GroupSelect;
