import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/toast-messages/useToast.jsx";
import dayjs from "dayjs";
import { useState } from "react";

const NewNewsEntryPage = ({ onClose, date }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const initialDate = dayjs(new Date()).format("YYYY-MM-DD");

  const [newNewsEntryData, setNewNewsEntryData] = useState({
    title: "",
    content: "",
    date: initialDate,
    public: true,
    pinned: false,
  })

  return <div>new news entry page</div>;
};

export default NewNewsEntryPage;