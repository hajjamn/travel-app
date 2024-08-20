<template>
    <h2>Update Travel Information</h2>
    <form action="/.netlify/functions/update" method="POST">
        <!-- Hidden field to store travel ID -->
        <input type="hidden" name="travel_id" value="TRAVEL_ID_HERE">

        <label for="destination">Destination:</label>
        <input type="text" name="destination" placeholder="Enter new destination" required><br><br>

        <label for="start_date">Start Date:</label>
        <input type="date" name="start_date" required><br><br>

        <label for="end_date">End Date:</label>
        <input type="date" name="end_date" required><br><br>
        <button type="submit">Update</button>
    </form>
</template>