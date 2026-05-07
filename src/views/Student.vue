<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../../utils/supabase";

const router = useRouter();
const route = useRoute();
const id = route.params.id;

const name = ref("");
const studentId = ref("");
const program = ref("");
const year = ref("");
const message = ref("");

async function getStudent() {
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    message.value = "Failed to load student data.";
    return;
  }

  name.value = student.name;
  studentId.value = student.student_id;
  program.value = student.program;
  year.value = student.year;
}

async function updateStudent() {
  if (!name.value || !studentId.value || !program.value || !year.value) {
    message.value = "Please complete all fields.";
    return;
  }

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
    router.push("/");
  } else {
    console.log(error);
    message.value = "Failed to update student.";
  }
}

onMounted(() => {
  getStudent();
});
</script>

<template>
  <main class="page">
    <button class="back-btn" @click="router.push('/')">← Back to records</button>

    <section class="hero">
      <p class="eyebrow">Student Record</p>
      <h1>Edit Student</h1>
      <p class="subtitle">
        Update the selected student information and save the changes to Supabase.
      </p>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <p class="section-label">Update details</p>
          <h2>Student Information</h2>
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

        <div class="actions">
          <button class="secondary-btn" @click="router.push('/')">
            Cancel
          </button>

          <button class="primary-btn" @click="updateStudent">
            Save Changes
          </button>
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
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 24px;
  font-family: "Inter", sans-serif;
  color: #1f2933;
}

.back-btn {
  margin-bottom: 32px;
  border: none;
  background: transparent;
  color: #7c7167;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.back-btn:hover {
  color: #1f2933;
}

.hero {
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
  font-size: clamp(36px, 6vw, 56px);
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

.card {
  background: #fffdf9;
  border: 1px solid #e7e0d7;
  border-radius: 24px;
  padding: 26px;
  box-shadow: 0 20px 50px rgba(38, 31, 25, 0.06);
}

.card-header {
  margin-bottom: 24px;
}

.card-header h2 {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.03em;
  color: #222;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
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
  align-items: center;
  gap: 16px;
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid #eee8df;
}

.message {
  margin: 0;
  font-size: 13px;
  color: #a33a2a;
}

.actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.primary-btn {
  padding: 12px 18px;
  background: #1f2933;
  color: #fffdf9;
}

.secondary-btn {
  padding: 12px 18px;
  background: #f1eee8;
  color: #1f2933;
}

.primary-btn:hover,
.secondary-btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

@media (max-width: 620px) {
  .page {
    padding: 32px 16px;
  }

  .card {
    padding: 20px;
    border-radius: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .actions {
    width: 100%;
    margin-left: 0;
    flex-direction: column-reverse;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}
</style>