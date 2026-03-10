const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Reminder } = require('../models/index');
const ApiError = require('../utils/ApiError');

const createReminder = catchAsync(async (req, res) => {
    const reminder = await Reminder.create({
        ...req.body,
        userId: req.user.id
    });
    res.status(httpStatus.CREATED).send(reminder);
});

const getReminders = catchAsync(async (req, res) => {
    const reminders = await Reminder.findAll({
        where: { userId: req.user.id },
        order: [['dueDate', 'ASC']]
    });
    res.status(httpStatus.OK).send(reminders);
});

const updateReminder = catchAsync(async (req, res) => {
    const reminder = await Reminder.findByPk(req.params.id);
    if (!reminder || reminder.userId !== req.user.id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Reminder not found');
    }
    Object.assign(reminder, req.body);
    await reminder.save();
    res.status(httpStatus.OK).send(reminder);
});

const deleteReminder = catchAsync(async (req, res) => {
    const reminder = await Reminder.findByPk(req.params.id);
    if (!reminder || reminder.userId !== req.user.id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Reminder not found');
    }
    await reminder.destroy();
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder
};
