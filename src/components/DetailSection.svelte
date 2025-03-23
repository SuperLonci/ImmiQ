<script lang="ts">
    export let title: string;
</script>

<div class="detail-section">
    <h3>{title}</h3>
    <slot></slot>
</div>

<style>
    .detail-section {
        margin-bottom: 15px;
    }

    h3 {
        font-size: 20px; /* Increase font size */
        color: #333;
        margin-bottom: 10px;
        font-weight: bold; /* Make the text bold */
        border-bottom: 2px solid #e0e0e0; /* Add a bottom border */
        padding-bottom: 5px; /* Add padding to the bottom */
    }
</style>