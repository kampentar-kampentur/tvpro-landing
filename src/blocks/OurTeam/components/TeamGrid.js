"use client"
import { useState, useEffect, useRef } from "react";
import TeamMemberGrid from "./TeamMemberGrid";

export default function TeamGrid({ members }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!members || members.length === 0) return;

    setLoading(true);
    // Simulate loading or directly use the provided members
    setTeamMembers(members);
    setLoading(false);
  }, [members]);

  return (
    <>
      {loading ? <div>Loading...</div> : <TeamMemberGrid images={teamMembers} />}
    </>
  );
}