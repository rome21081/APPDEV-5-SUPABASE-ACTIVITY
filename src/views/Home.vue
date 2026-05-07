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
const message = ref("");

async function getAllStudents() {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id", { ascending: true });

  if (!error) {
    students.value = data || [];
  } else {
    console.log(error);
    message.value = "Failed to load students.";
  }
}

async function insertStudent() {
  if (!name.value || !studentId.value || !program.value || !year.value) {
    message.value = "Please complete all fields.";
    return;
  }

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

    message.value = "Student added successfully.";
    name.value = "";
    studentId.value = "";
    program.value = "";
    year.value = "";
  } else {
    console.log(error);
    message.value = "Failed to add student.";
  }
}

async function deleteStudent(id) {
  const confirmDelete = confirm("Are you sure you want to delete this student?");

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id);

  if (!error) {
    await getAllStudents();
    message.value = "Student deleted successfully.";
  } else {
    console.log(error);
    message.value = "Failed to delete student.";
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
  <main class="page">
    <section class="hero">
      <div>
        <p class="eyebrow">APPDEV 5 · Supabase Activity</p>
        <h1>Student Management</h1>
        <p class="subtitle">
          A simple Vue CRUD system connected to Supabase for managing student records.
        </p>
      </div>

      <div class="profile-card">
        <span>Created by</span>
        <strong>Jerome Lagmay</strong>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <p class="section-label">New record</p>
          <h2>Add Student</h2>
        </div>
      </div>

      <div class="form-grid">
        <div class="input-group">
          <label>Student Name</label>
          <input v-model="name" type="text" placeholder="Enter full name" />
        </div>

        <div class="input-group">
          <label>Student ID</label>
          <input v-model="studentId" type="text" placeholder="Enter student ID" />
        </div>

        <div class="input-group">
          <label>Program</label>
          <input v-model="program" type="text" placeholder="Example: BSIT" />
        </div>

        <div class="input-group">
          <label>Year Level</label>
          <select v-model="year">
            <option value="" disabled>Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
      </div>

      <div class="form-footer">
        <p v-if="message" class="message">{{ message }}</p>
        <button @click="insertStudent" class="primary-btn">Add Student</button>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <p class="section-label">Records</p>
          <h2>Students</h2>
        </div>

        <span class="count">{{ students.length }} total</span>
      </div>

      <div class="table-wrapper">
        <div class="table-header">
          <span>Name</span>
          <span>Student ID</span>
          <span>Program</span>
          <span>Year</span>
          <span>Actions</span>
        </div>

        <div v-if="students.length === 0" class="empty">
          No student records yet.
        </div>

        <div
          v-for="student in students"
          :key="student.id"
          class="table-row"
        >
          <span class="student-name">{{ student.name }}</span>
          <span>{{ student.student_id }}</span>
          <span>{{ student.program }}</span>
          <span>{{ student.year }}</span>

          <div class="actions">
            <button @click="goToStudent(student.id)" class="secondary-btn">
              Edit
            </button>

            <button @click="deleteStudent(student.id)" class="danger-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  background: #f6f3ee;
}
</style>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

*,
*::before,
*::after {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px;
  font-family: "Inter", sans-serif;
  color: #1f2933;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-end;
  margin-bottom: 28px;
}

.eyebrow,
.section-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8a7f73;
}

h1 {
  margin: 0;
  font-size: clamp(34px, 5vw, 56px);
  line-height: 1;
  letter-spacing: -0.05em;
  color: #171717;
}

.subtitle {
  max-width: 560px;
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: #6b6259;
}

.profile-card {
  min-width: 210px;
  padding: 18px;
  border: 1px solid #e2ddd4;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.5);
}

.profile-card span {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: #8a7f73;
}

.profile-card strong {
  font-size: 15px;
  color: #171717;
}

.card {
  background: #fffdf9;
  border: 1px solid #e7e0d7;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 20px 50px rgba(38, 31, 25, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 22px;
}

.card-header h2 {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.03em;
  color: #222;
}

.count {
  padding: 8px 12px;
  border-radius: 999px;
  background: #f1eee8;
  font-size: 12px;
  font-weight: 600;
  color: #6b6259;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: #6b6259;
}

input,
select {
  width: 100%;
  border: 1px solid #ddd6cd;
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  font-family: inherit;
  font-size: 14px;
  color: #222;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input::placeholder {
  color: #aaa29a;
}

input:focus,
select:focus {
  border-color: #1f2933;
  box-shadow: 0 0 0 4px rgba(31, 41, 51, 0.08);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-top: 20px;
}

.message {
  margin: 0;
  font-size: 13px;
  color: #6b6259;
}

.primary-btn,
.secondary-btn,
.danger-btn {
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s, background 0.15s;
}

.primary-btn {
  padding: 12px 18px;
  background: #1f2933;
  color: #fffdf9;
}

.secondary-btn,
.danger-btn {
  padding: 8px 12px;
}

.secondary-btn {
  background: #f1eee8;
  color: #1f2933;
}

.danger-btn {
  background: #fff0ed;
  color: #a33a2a;
}

.primary-btn:hover,
.secondary-btn:hover,
.danger-btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.table-wrapper {
  overflow-x: auto;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.8fr 0.8fr 1fr;
  gap: 16px;
  align-items: center;
  min-width: 760px;
}

.table-header {
  padding: 12px 14px;
  border-radius: 14px;
  background: #f5f1eb;
  font-size: 12px;
  font-weight: 700;
  color: #7c7167;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.table-row {
  padding: 16px 14px;
  border-bottom: 1px solid #eee8df;
  font-size: 14px;
  color: #514941;
}

.student-name {
  font-weight: 700;
  color: #222;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.empty {
  padding: 30px 14px;
  text-align: center;
  font-size: 14px;
  color: #8a7f73;
}

@media (max-width: 850px) {
  .hero {
    align-items: stretch;
    flex-direction: column;
  }

  .profile-card {
    min-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .page {
    padding: 32px 16px;
  }

  .card {
    padding: 18px;
    border-radius: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }
}
</style>