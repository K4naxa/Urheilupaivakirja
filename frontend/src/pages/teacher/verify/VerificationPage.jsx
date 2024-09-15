import groupService from "../../../services/groupService";
import sportService from "../../../services/sportService";
import miscService from "../../../services/miscService";
import studentService from "../../../services/studentService";
import { FiTrash2, FiCheck } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "../../../components/LoadingScreen";
import { useToast } from "../../../hooks/toast-messages/useToast";
import { add } from "date-fns";

const VerificationPage = () => {
  const {
    data: unverifiedData = { students: [], sports: [], student_groups: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unverifiedStudentsSportsCampuses"],
    queryFn: miscService.getUnverifiedStudentsSportsCampuses,
  });

  const {
    students: unverifiedStudents = [],
    sports: unverifiedSports = [],
    student_groups: unverifiedStudentGroupes = [],
    email_not_verified_students: emailNotVerifiedStudents = [],
  } = unverifiedData || {};

  console.log("emailNotVerifiedStudents", emailNotVerifiedStudents);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Student container */}
      <div className="md:col-span-2 flex flex-col bg-bgSecondary rounded-md border border-borderPrimary min-w-96">
        <div className="w-full py-2 rounded-t-md border-b border-borderPrimary text-xl text-center">
          <h2>Oppilaat</h2>
        </div>
        <div className="w-full py-2">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingScreen />
            </div>
          ) : error ? (
            <div className="text-center w-full text-red-500">
              Error: {error.message}
            </div>
          ) : (
            <div className="flex justify-center lg:justify-start flex-wrap gap-4 p-2 max-h-[600px] overflow-auto">
              {unverifiedStudents.length === 0 ? (
                <div className="text-center w-full text-textSecondary">
                  Ei hyväksyttäviä oppilaita
                </div>
              ) : (
                unverifiedStudents.map((student) => (
                  <CreateStudentContainer
                    key={student.user_id}
                    student={student}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sport container */}
      <div className="flex flex-col bg-bgSecondary rounded-md border border-borderPrimary min-w-96">
        <div className="w-full py-2 rounded-t-md border-b border-borderPrimary text-xl text-center">
          <h2>Lajit</h2>
        </div>
        <div className=" w-full py-2">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingScreen />
            </div>
          ) : error ? (
            <div className="text-center w-full text-red-500">
              Error: {error.message}
            </div>
          ) : (
            <div className=" flex flex-col gap-4 p-2 bg-bgSecondary">
              {unverifiedSports.length === 0 ? (
                <div className="text-center text-textSecondary">
                  Ei hyväksymistä odottavia lajeja
                </div>
              ) : (
                unverifiedSports.map((sport) => (
                  <CreateSportContainer key={sport.id} sport={sport} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* StudentGroup container */}

      <div className="flex flex-col bg-bgSecondary rounded-md border border-borderPrimary min-w-96">
        <div className="w-full py-2 rounded-t-md border-b border-borderPrimary text-xl text-center">
          <h2>Ryhmät</h2>
        </div>
        <div className=" w-full py-2">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingScreen />
            </div>
          ) : error ? (
            <div className="text-center w-full text-red-500">
              Error: {error.message}
            </div>
          ) : (
            <div className=" flex flex-col gap-4 p-2 bg-bgSecondary">
              {unverifiedStudentGroupes.length === 0 ? (
                <div className="text-center text-textSecondary">
                  Ei hyväksymistä odottavia ryhmiä
                </div>
              ) : (
                unverifiedStudentGroupes.map((student_group) => (
                  <CreateStudentGroupContainer
                    key={student_group.id}
                    student_group={student_group}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {emailNotVerifiedStudents.length > 0 && (
        <div className="flex flex-col col-span-2 bg-bgSecondary rounded-md border border-borderPrimary min-w-96">
          <div className="w-full py-2 rounded-t-md border-b border-borderPrimary text-xl text-center">
            <h2>Oppilaat, jotka eivät ole varmistaneet sähköpostiaan:</h2>
          </div>
          <div className="w-full py-2">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingScreen />
              </div>
            ) : error ? (
              <div className="text-center w-full text-red-500">
                Error: {error.message}
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-2 bg-bgSecondary">
                {emailNotVerifiedStudents.map((student) => (
                  <CreateEmailNotVerifiedStudentContainer
                    key={student.user_id} // Use student.user_id as the unique key
                    student={student}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function CreateStudentContainer({ student }) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const verifyStudentMutation = useMutation({
    mutationFn: () => studentService.verifyStudent(student.user_id),
    onSuccess: () => {
      addToast("Oppilas hyväksytty", { style: "success" });
      queryClient.invalidateQueries({
        queryKey: ["unverifiedStudentsSportsCampuses"],
      });
      queryClient.invalidateQueries({ queryKey: ["StudentsList"] });
    },
    onError: (error) => {
      addToast("Virhe hyväksyttäessä oppilasta", { style: "error" });
      console.error("Error verifying student:", error);
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: () => studentService.deleteStudent(student.user_id),
    onSuccess: () => {
      addToast("Oppilas poistettu", { style: "success" });
      queryClient.invalidateQueries({
        queryKey: ["unverifiedStudentsSportsCampuses"],
      });
    },
    onError: (error) => {
      addToast("Virhe poistettaessa oppilasta", { style: "error" });
      console.error("Error deleting student:", error);
    },
  });

  return (
    <div
      key={student.id}
      className="flex flex-col hover:bg-hoverDefault p-4 rounded-md gap-2
      border border-borderPrimary"
    >
      {/* User title */}
      <div className="text-center text-xl">
        {student.first_name} {student.last_name}
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Email:</p> <p>{student.email}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Laji:</p> <p>{student.sport}</p>
      </div>

      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Ryhmä:</p> <p>{student.group}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Toimipiste:</p>{" "}
        <p>{student.campus}</p>
      </div>

      {/* buttons */}
      <div className="flex gap-4 justify-center">
        {" "}
        <button
          className="text-iconGreen hover:scale-110  p-1 rounded-md "
          onClick={() => {
            console.log();
            verifyStudentMutation.mutate();
          }}
        >
          <FiCheck size={20} />
        </button>
        <button
          className="text-iconRed p-1 hover:scale-110 rounded-md"
          onClick={() => deleteStudentMutation.mutate()}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
}

function CreateEmailNotVerifiedStudentContainer({ student }) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const deleteStudentMutation = useMutation({
    mutationFn: () => studentService.deleteStudent(student.user_id),
    onSuccess: () => {
      addToast("Oppilas poistettu", { style: "success" });
      queryClient.invalidateQueries({
        queryKey: ["unverifiedStudentsSportsCampuses"],
      });
    },
    onError: (error) => {
      addToast("Virhe poistettaessa oppilasta", { style: "error" });
      console.error("Error deleting student:", error);
    },
  });

  return (
    <div
      key={student.id}
      className="flex flex-col hover:bg-hoverDefault p-4 rounded-md gap-2
      border border-borderPrimary"
    >
      {/* User title */}
      <div className="text-center text-xl">
        {student.first_name} {student.last_name}
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Email:</p> <p>{student.email}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Laji:</p> <p>{student.sport}</p>
      </div>

      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Ryhmä:</p> <p>{student.group}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Toimipiste:</p>{" "}
        <p>{student.campus}</p>
      </div>

      {/* buttons */}
      <div className="flex gap-4 justify-center">
        <button
          className="text-iconRed p-1 hover:scale-110 rounded-md"
          onClick={() => deleteStudentMutation.mutate()}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
}

const CreateStudentGroupContainer = ({ student_group }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const verifyStudentGroupMutation = useMutation({
    mutationFn: () => groupService.verifyStudentGroup(student_group.id),
    onSuccess: () => {
      addToast("Ryhmä hyväksytty", { style: "success" });
      queryClient.invalidateQueries({
        queryKey: ["unverifiedStudentsSportsCampuses"],
      });
    },
    onError: () => {
      addToast("Virhe hyväksyttäessä ryhmää", { style: "error" });
    },
  });

  const deleteStudentGroupMutation = useMutation({
    mutationFn: () => groupService.deleteGroup(student_group.id),
    onSuccess: () => {
      addToast("Ryhmä poistettu", { style: "success" });
      queryClient.invalidateQueries({
        queryKey: ["unverifiedStudentsSportsCampuses"],
      });
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        addToast("Poisto epäonnistui, koska ryhmässä on opiskelijoita.", {
          style: "error",
        });
      } else {
        addToast("Virhe poistettaessa ryhmää", { style: "error" });
      }
    },
  });

  return (
    <div
      key={student_group.id}
      className="flex justify-between hover:bg-hoverDefault  p-4 rounded-md gap-2
      border border-borderPrimary"
    >
      {/* StudentGroup title */}
      <div className="text-center flex items-end gap-2">
        <div>
          <p className="text-xl m-0">{student_group.name}</p>
        </div>
        <div>
          <p className="text-textSecondary text-sm  m-0.5">
            Luonut: {student_group.created_by}
          </p>
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-4 justify-center">
        {" "}
        <button
          className="text-iconGreen hover:bg-bgSecondary  border-bgSecondary border hover:border-borderPrimary hover:scale-110  p-1 rounded-md "
          onClick={() => verifyStudentGroupMutation.mutate()}
        >
          <FiCheck size={20} />
        </button>
        <button
          className="text-iconRed p-1 hover:scale-110 rounded-md"
          onClick={() => deleteStudentGroupMutation.mutate()}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const CreateSportContainer = ({ sport }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const verifySportMutation = useMutation({
    mutationFn: () => sportService.verifySport(sport.id),
    onSuccess: () => {
      addToast("Laji hyväksytty", { style: "success" });
      queryClient.invalidateQueries({
        queryKey: ["unverifiedStudentsSportsCampuses"],
      });
    },
    onError: () => {
      addToast("Virhe hyväksyttäessä lajia", { style: "error" });
    },
  });

  const deleteSportMutation = useMutation({
    mutationFn: () => sportService.deleteSport(sport.id),
    onSuccess: () => {
      addToast("Laji poistettu", { style: "success" });
      queryClient.invalidateQueries({
        queryKey: ["unverifiedStudentsSportsCampuses"],
      });
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        addToast("Poisto epäonnistui, koska lajilla on opiskelijoita.", {
          style: "error",
        });
      } else {
        addToast("Virhe poistettaessa lajia", { style: "error" });
      }
    },
  });

  return (
    <div
      key={sport.id}
      className="flex justify-between hover:bg-hoverDefault  p-4 rounded-md gap-2
      border border-borderPrimary"
    >
      {/* Sport title */}
      <div className="text-center flex items-end gap-2">
        <div>
          <p className="text-xl m-0">{sport.name}</p>
        </div>
        <div>
          <p className="text-textSecondary text-sm  m-0.5">
            Luonut: {sport.created_by}
          </p>
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-4 justify-center">
        {" "}
        <button
          className="text-iconGreen hover:scale-110  p-1 rounded-md "
          onClick={() => verifySportMutation.mutate()}
        >
          <FiCheck size={20} />
        </button>
        <button
          className="text-iconRed p-1 hover:scale-110 rounded-md"
          onClick={() => deleteSportMutation.mutate()}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default VerificationPage;
