<script lang="ts">
    export let label: string;
</script>

<p class="detail-item">
    <strong>{label}:</strong>
    <slot></slot>
</p>

<style>
    .detail-item {
        background-color: #fff;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>