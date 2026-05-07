<script setup>
import { useRouter } from "vue-router";
import { supabase } from "../../utils/supabase";
import { onMounted, ref } from "vue";

const router = useRouter();

const name = ref("");
const studentId = ref("");
const program = ref("");
const year = ref("");
const students = ref([]);

async function getAllStudents() {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id", { ascending: true });

  if (!error) {
    students.value = data;
  } else {
    console.log(error);
  }
}

async function insertStudent() {
  const { error } = await supabase
    .from("students")
    .insert([
      {
        name: name.value,
        student_id: studentId.value,
        program: program.value,
        year: year.value,
      },
    ])
    .select();

  if (!error) {
    await getAllStudents();
    console.log("Student added successfully");

    name.value = "";
    studentId.value = "";
    program.value = "";
    year.value = "";
  } else {
    console.log(error);
  }
}

async function deleteStudent(id) {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id);

  if (!error) {
    await getAllStudents();
    console.log("Student deleted successfully");
  } else {
    console.log(error);
  }
}

function goToStudent(id) {
  router.push(`/students/${id}`);
}

onMounted(() => {
  getAllStudents();
});
</script>

<template>
  <div class="page">
    <h1 class="title">JEROME LAGMAY'S ACTIVITY </h1>
     <h1 class="title"> ______________ </h1>
    <header class="page-header">
      <p class="label">student records</p>
      <h1 class="title">Students</h1>
    </header>

    <section class="form">
      <input v-model="name" class="field" placeholder="Student Name" />

      <input v-model="studentId" class="field" placeholder="Student ID" />

      <input v-model="program" class="field" placeholder="Program" />

      <select v-model="year" class="field">
        <option value="" disabled>Select Year</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>

      <button @click="insertStudent" class="btn">Add</button>
    </section>

    <section class="list">
      <div class="list-header">
        <span>Name</span>
        <span>Student ID</span>
        <span>Program</span>
        <span>Year</span>
        <span>Actions</span>
      </div>

      <ul>
        <li v-for="student in students" :key="student.id" class="list-row">
          <span>{{ student.name }}</span>
          <span>{{ student.student_id }}</span>
          <span>{{ student.program }}</span>
          <span>{{ student.year }}</span>

          <div class="actions">
            <button @click="deleteStudent(student.id)" class="btn small">
              Delete
            </button>

            <button @click="goToStudent(student.id)" class="btn small">
              Edit
            </button>
          </div>
        </li>

        <li v-if="students.length === 0" class="empty">
          No students found.
        </li>
      </ul>
    </section>
  </div>
</template>

<style>
body {
  background: #f7f6f3;
  margin: 0;
}
</style>

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
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #d4d0c8;
  padding-bottom: 1rem;
}

.label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 0.35rem;
}

.title {
  font-family: "Cormorant", serif;
  font-size: 2.8rem;
  font-weight: 400;
  line-height: 1;
  color: #111;
}

.form {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.field {
  flex: 1;
  min-width: 150px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #c8c4bb;
  padding: 0.4rem 0;
  font-family: "DM Mono", monospace;
  font-size: 0.8rem;
  color: #111;
  outline: none;
  transition: border-color 0.2s;
}

.field::placeholder {
  color: #aaa;
}

.field:focus {
  border-bottom-color: #111;
}

select.field {
  cursor: pointer;
}

.btn {
  background: #111;
  color: #f7f6f3;
  border: none;
  padding: 0.45rem 1.1rem;
  font-family: "DM Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn:hover {
  opacity: 0.75;
}

.btn.small {
  padding: 0.35rem 0.75rem;
  font-size: 0.65rem;
}

.list {
  font-size: 0.8rem;
}

.list-header {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1fr 1fr 1.4fr;
  gap: 1rem;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #999;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #d4d0c8;
  margin-bottom: 0.25rem;
}

ul {
  list-style: none;
}

.list-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1fr 1fr 1.4fr;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eae8e3;
  color: #222;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.empty {
  color: #bbb;
  font-size: 0.75rem;
  padding-top: 1rem;
}
</style>