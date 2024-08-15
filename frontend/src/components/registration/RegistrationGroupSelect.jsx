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
      borderColor:
        errors.groupId && errors.groupId.value === 'error'
          ? 'red'
          : errors.groupId && errors.groupId.value === 'success'
          ? 'green'
          : provided.borderColor,
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
          inputClass +
          (errors.groupId && errors.groupId.value
            ? errors.groupId.value === 'error'
              ? ' border-red-500'
              : errors.groupId.value === 'success'
              ? ' border-green-500'
              : ''
            : '')
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
        
        placeholder="Valitse ryhmä"
        isClearable
        formatCreateLabel={formatCreateLabel}
      />
  );
};

export default GroupSelect;
