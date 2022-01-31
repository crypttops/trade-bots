<template>
    <div class="expand-row">
        <Row>
            <Col span="8">
                <span class="expand-key">Bot Name: </span>
                <span class="expand-value">{{ bot.botName }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">Exchange: </span>
                <span class="expand-value">{{ bot.exchange_id }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">Created On: </span>
                <span class="expand-value">{{ bot.createdAt }}</span>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    props: {
        bot: Object
    }
}
</script>

<style>

</style>