import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const GroupMultiSelect = ({
  groupArray,
  selectedGroups,
  setSelectedGroups,
  filter,
}) => {
  // Ensure filter is a string
  const filterString = typeof filter === "string" ? filter.toLowerCase() : "";
  // Filter groups based on the input filter
  const filteredGroups = groupArray?.filter((group) =>
    group.group_identifier.toLowerCase().includes(filterString)
  );

  // Map filtered groups to the format required by react-select
  const groupOptions = filteredGroups.map((group) => ({
    value: group.id,
    label: group.group_identifier,
  }));

  // Handle change in selected groups
  const handleSelectChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions);
  };

  return (
    <Select
      isMulti
      components={makeAnimated()}
      value={selectedGroups}
      openMenuOnFocus={false}
      openMenuOnClick={false}
      styles={{
        // Styles for the select component
        control: (provided) => ({
          ...provided,
          border: "1px solid rgb(var(--color-border-primary))",
          color: "rgb(var(--color-text-primary))",
          borderRadius: "0.375rem",
          minWidth: "15rem",
          minHeight: "2.5rem",
          backgroundColor: "rgb(var(--color-bg-secondary))",
        }),

        // Styles for the input field text color
        input: (provided) => ({
          ...provided,
          color: "rgb(var(--color-text-primary))",
        }),

        // Styles of the whole component of group when multiple values are selected
        multiValue: (provided) => ({
          ...provided,
          borderRight: "1px solid rgb(var(--color-border-primary))",
          borderRadius: "0.375rem",
          backgroundColor: "rgb(var(--color-bg-gray))",
        }),
        // label of the selected component
        multiValueLabel: (provided) => ({
          ...provided,
          borderRadius: "0.375rem 0 0 0.375rem",
          color: "rgb(var(--color-text-primary))",
        }),

        // x button to remove a selected value
        multiValueRemove: (provided) => ({
          ...provided,
          color: "rgb(var(--color-text-primary))",
          ":hover": {
            backgroundColor: "rgb(var(--color-bg-primary))",
            color: "rgb(var(--color-text-primary))",
          },
        }),

        // styles for the dropdown options
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected
            ? "rgb(var(--color-primary))"
            : state.isFocused
              ? "rgb(var(--color-primary))"
              : "rgb(var(--color-bg-secondary))",
          color: "rgb(var(--color-text-primary))",
          ":active": {
            backgroundColor: "rgb(var(--color-bg-primary))",
            color: "rgb(var(--color-text-primary))",
          },
        }),

        // Styles for the dropdown menu when opened
        menu: (provided) => ({
          ...provided,
          backgroundColor: "rgb(var(--color-bg-secondary))",
          color: "rgb(var(--color-text-primary))",
        }),
      }}
      onChange={handleSelectChange}
      options={groupOptions}
      closeMenuOnSelect={false}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Select Groups"
    />
  );
};

export default GroupMultiSelect;
