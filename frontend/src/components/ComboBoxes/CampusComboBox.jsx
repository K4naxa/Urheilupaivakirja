import { Combobox, Transition } from "@headlessui/react";

import { useState, Fragment } from "react";
import { FiCheck } from "react-icons/fi";

function CampusComboBox({ campuses, selectedCampus, setSelectedCampus }) {
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? campuses
      : campuses.filter((campus) => {
          return campus.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="text-textPrimary">
      <Combobox value={selectedCampus} onChange={setSelectedCampus} nullable>
        <div className="relative mt-1">
          <div
            className="relative w-full cursor-default overflow-hidden border-b
            focus-visible:border-headerPrimary  border-borderPrimary"
          >
            {/* default input field */}
            <Combobox.Input
              className="w-full border-none p-2
                focus-visible:outline-none bg-bgkSecondary"
              displayValue={(campus) => campus?.name}
              placeholder="Hae Toimipiste"
              onChange={(event) => setQuery(event.target.value)}
            />
            {/* button to list all options */}
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FiCheck
                className="h-5 w-5 text-headerPrimary"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            enterFrom="opacity-0"
            enter="transition ease-out duration-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            {/* list of choises */}
            <Combobox.Options
              className="absolute mt-1 max-h-60 w-full overflow-auto bg-bgkSecondary rounded-md py-1 text-base shadow-lg
               ring-1 ring-black/5 focus:outline-none sm:text-sm"
            >
              {/* if nothing is found */}
              {filteredPeople?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-textSecondary">
                  Nothing found.
                </div>
              ) : (
                // if something is found > list them
                filteredPeople?.map((campus) => (
                  <Combobox.Option
                    key={campus.id}
                    className={({ active }) =>
                      `relative cursor-default select-none p-2 pr-4 ${
                        active
                          ? "bg-headerPrimary text-white"
                          : "text-textPrimary"
                      }`
                    }
                    value={campus}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {campus.name}
                        </span>
                        {/* person  "active" or selected from the list */}
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          ></span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default CampusComboBox;
