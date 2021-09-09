-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 09, 2021 at 07:17 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mushroom`
--

-- --------------------------------------------------------

--
-- Table structure for table `mushroom`
--

CREATE TABLE `mushroom` (
  `id` int(11) NOT NULL,
  `mushroom` char(20) COLLATE utf8_swedish_ci NOT NULL,
  `weight` smallint(4) NOT NULL,
  `price` decimal(4,2) NOT NULL,
  `rating` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Dumping data for table `mushroom`
--

INSERT INTO `mushroom` (`id`, `mushroom`, `weight`, `price`, `rating`) VALUES
(1, 'baravykas', 500, '20.00', 5),
(2, 'raudonikis', 200, '10.00', 5),
(3, 'voveraite', 100, '7.00', 3),
(4, 'umede', 150, '8.00', 4),
(5, 'kazlekas', 250, '10.00', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mushroom`
--
ALTER TABLE `mushroom`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mushroom`
--
ALTER TABLE `mushroom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
