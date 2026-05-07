<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../../utils/supabase";

// Get the ID from URL
const router = useRouter();
const route = useRoute();
const id = route.params.id;

const name = ref("");
const studentId = ref("");
const program = ref("");
const year = ref("");

async function getStudent() {
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  name.value = student.name;
  studentId.value = student.student_id;
  program.value = student.program;
  year.value = student.year;
}

async function updateStudent() {
  const { error } = await supabase
    .from("students")
    .update({
      name: name.value,
      student_id: studentId.value,
      program: program.value,
      year: year.value,
    })
    .eq("id", id)
    .select();

  if (!error) {
    console.log("Student updated successfully");
    router.push("/");
  } else {
    console.log(error);
  }
}

onMounted(() => {
  getStudent();
});
</script>

<template>
  <div class="page">
    <button class="back" @click="router.push('/')">← Back</button>

    <h1 class="title">Edit Student</h1>

    <div class="form">
      <label>Student Name</label>
      <input v-model="name" class="field" placeholder="Student Name" />

      <label>Student ID</label>
      <input v-model="studentId" class="field" placeholder="Student ID" />

      <label>Program</label>
      <input v-model="program" class="field" placeholder="Program" />

      <label>Year</label>
      <select v-model="year" class="field">
        <option value="" disabled>Select Year</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>

      <button @click="updateStudent" class="btn">Save</button>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500&family=DM+Mono:wght@300;400&display=swap");

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  min-height: 100vh;
  background: #f7f6f3;
  color: #111;
  font-family: "DM Mono", monospace;
  padding: 4rem 2rem;
  max-width: 560px;
  margin: 0 auto;
}

.back {
  background: none;
  border: none;
  font-family: "DM Mono", monospace;
  font-size: 0.75rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  margin-bottom: 2rem;
}

.back:hover {
  color: #111;
}

.title {
  font-family: "Cormorant", serif;
  font-size: 2.8rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #999;
}

.field {
  background: transparent;
  border: none;
  border-bottom: 1px solid #c8c4bb;
  padding: 0.4rem 0;
  font-family: "DM Mono", monospace;
  font-size: 0.8rem;
  color: #111;
  outline: none;
  margin-bottom: 0.75rem;
}

.field:focus {
  border-bottom-color: #111;
}

select.field {
  cursor: pointer;
}

.btn {
  margin-top: 0.5rem;
  align-self: flex-start;
  background: #111;
  color: #f7f6f3;
  border: none;
  padding: 0.45rem 1.1rem;
  font-family: "DM Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  cursor: pointer;
}

.btn:hover {
  opacity: 0.75;
}
</style>